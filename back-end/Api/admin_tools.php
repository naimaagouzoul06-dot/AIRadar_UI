<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── GET ───────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Charger un outil complet pour l'édition
    if (isset($_GET['tool_id'])) {
        $id   = (int)$_GET['tool_id'];
        $stmt = $pdo->prepare("
            SELECT t.*,
                   c.name AS category_name
            FROM ai_tools t
            JOIN categories c ON c.id = t.categorie_principale_id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);
        $tool = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$tool) { http_response_code(404); echo json_encode(['success'=>false,'error'=>'Outil introuvable']); exit; }

        // Tags associés
        $tags = $pdo->prepare("
            SELECT tag_id FROM tool_tags WHERE tool_id = ?
        ");
        $tags->execute([$id]);
        $tool['tag_ids'] = array_column($tags->fetchAll(PDO::FETCH_ASSOC), 'tag_id');

        // Données pour les selects
        $tool['_categories'] = $pdo->query("SELECT id, name FROM categories ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
        $tool['_tags']       = $pdo->query("SELECT id, name FROM tags ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'tool' => $tool]);
        exit;
    }

    // Liste complète des outils
    $stmt = $pdo->query("
        SELECT t.id, t.name, t.status, t.pricing_type, t.global_rating,
               c.name AS category, co.name AS company_name
        FROM ai_tools t
        JOIN categories c  ON t.categorie_principale_id = c.id
        LEFT JOIN companies co ON t.company_id = co.id
        ORDER BY t.name ASC
    ");
    echo json_encode(['success' => true, 'tools' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

// ─── POST ──────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action']  ?? '';
    $id     = (int)($data['tool_id'] ?? 0);

    if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Tool ID required']); exit; }

    // ── ACTIVATE / DEACTIVATE / DELETE ────────────────────────────────────
    if ($action === 'activate') {
        $pdo->prepare('UPDATE ai_tools SET status = "active" WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'deactivate') {
        $pdo->prepare('UPDATE ai_tools SET status = "inactive" WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'delete') {
        $pdo->prepare('DELETE FROM ai_tools WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);

    // ── EDIT ──────────────────────────────────────────────────────────────
    } elseif ($action === 'edit') {
        $required = ['name', 'description', 'website_url', 'pricing_type', 'category_id'];
        foreach ($required as $f) {
            if (empty($data[$f])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "Champ requis : $f"]);
                exit;
            }
        }

        $pdo->prepare("
            UPDATE ai_tools SET
                name                  = ?,
                description           = ?,
                website_url           = ?,
                logo_url              = ?,
                pricing_type          = ?,
                categorie_principale_id = ?,
                api_available         = ?,
                is_new                = ?,
                release_date          = ?,
                is_available_web      = ?,
                is_available_windows  = ?,
                is_available_mac      = ?,
                is_available_ios      = ?,
                is_available_android  = ?,
                updated_at            = NOW()
            WHERE id = ?
        ")->execute([
            trim($data['name']),
            trim($data['description']),
            trim($data['website_url']),
            trim($data['logo_url']        ?? '') ?: null,
            $data['pricing_type'],
            (int)$data['category_id'],
            !empty($data['api_available']) ? 1 : 0,
            !empty($data['is_new'])        ? 1 : 0,
            !empty($data['release_date'])  ? $data['release_date'] : null,
            !empty($data['is_available_web'])     ? 1 : 0,
            !empty($data['is_available_windows']) ? 1 : 0,
            !empty($data['is_available_mac'])     ? 1 : 0,
            !empty($data['is_available_ios'])     ? 1 : 0,
            !empty($data['is_available_android']) ? 1 : 0,
            $id,
        ]);

        // Mettre à jour les tags : supprimer les anciens, insérer les nouveaux
        $pdo->prepare('DELETE FROM tool_tags WHERE tool_id = ?')->execute([$id]);
        if (!empty($data['tag_ids'])) {
            $ins = $pdo->prepare('INSERT IGNORE INTO tool_tags (tool_id, tag_id) VALUES (?, ?)');
            foreach ($data['tag_ids'] as $tid) {
                $ins->execute([$id, (int)$tid]);
            }
        }

        echo json_encode(['success' => true]);

    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
    }
    exit;
}