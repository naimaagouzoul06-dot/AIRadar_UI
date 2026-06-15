<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── Vérifier si la colonne moderation_status existe dans reviews ──────────
function columnExists($pdo, $table, $column) {
    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = ?
              AND COLUMN_NAME  = ?
        ");
        $stmt->execute([$table, $column]);
        return $stmt->fetchColumn() > 0;
    } catch (Exception $e) {
        return false;
    }
}

// ─── GET : liste des commentaires ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? 'all';

    $hasModerationCol = columnExists($pdo, 'reviews', 'moderation_status');

    // Si la colonne n'existe pas encore (ALTER non exécuté), on la crée à la volée
    if (!$hasModerationCol) {
        try {
            $pdo->exec("ALTER TABLE reviews ADD COLUMN moderation_status ENUM('active','pending','inactive') DEFAULT 'active'");
            $hasModerationCol = true;
        } catch (Exception $e) {
            // Si on ne peut pas, on retourne quand même les reviews sans le filtre statut
        }
    }

    // Colonne disponible : requête avec filtre moderation_status
    if ($hasModerationCol) {
        if ($status === 'all') {
            $stmt = $pdo->query("
                SELECT r.id, r.rating, r.comment, r.created_at,
                       COALESCE(r.moderation_status, 'active') AS moderation_status,
                       u.name AS user_name,
                       t.name AS tool_name
                FROM reviews r
                JOIN users    u ON u.id = r.user_id
                JOIN ai_tools t ON t.id = r.tool_id
                ORDER BY r.created_at DESC
            ");
        } else {
            $stmt = $pdo->prepare("
                SELECT r.id, r.rating, r.comment, r.created_at,
                       COALESCE(r.moderation_status, 'active') AS moderation_status,
                       u.name AS user_name,
                       t.name AS tool_name
                FROM reviews r
                JOIN users    u ON u.id = r.user_id
                JOIN ai_tools t ON t.id = r.tool_id
                WHERE COALESCE(r.moderation_status, 'active') = ?
                ORDER BY r.created_at DESC
            ");
            $stmt->execute([$status]);
        }
    } else {
        // Colonne inexistante et ALTER impossible : retourner toutes les reviews sans filtre statut
        $stmt = $pdo->query("
            SELECT r.id, r.rating, r.comment, r.created_at,
                   'active' AS moderation_status,
                   u.name AS user_name,
                   t.name AS tool_name
            FROM reviews r
            JOIN users    u ON u.id = r.user_id
            JOIN ai_tools t ON t.id = r.tool_id
            ORDER BY r.created_at DESC
        ");
    }

    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'reviews' => $reviews]);
    exit;
}

// ─── POST : delete / moderate ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action']    ?? '';
    $id     = (int)($data['review_id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Review ID required']);
        exit;
    }

    if ($action === 'delete') {
        $pdo->prepare('DELETE FROM reviews WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'moderate') {
        $newStatus = $data['status'] ?? '';
        $allowed   = ['active', 'pending', 'inactive'];
        if (!in_array($newStatus, $allowed)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid status']);
            exit;
        }
        // S'assurer que la colonne existe avant de l'update
        if (!columnExists($pdo, 'reviews', 'moderation_status')) {
            $pdo->exec("ALTER TABLE reviews ADD COLUMN moderation_status ENUM('active','pending','inactive') DEFAULT 'active'");
        }
        $pdo->prepare('UPDATE reviews SET moderation_status = ? WHERE id = ?')
            ->execute([$newStatus, $id]);
        echo json_encode(['success' => true]);

    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
    }
    exit;
}