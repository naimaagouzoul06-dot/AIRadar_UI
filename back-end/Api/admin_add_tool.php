<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── GET : récupérer catégories + tags pour les selects ───────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $categories = $pdo->query('SELECT id, name FROM categories ORDER BY name ASC')->fetchAll(PDO::FETCH_ASSOC);
    $tags       = $pdo->query('SELECT id, name FROM tags ORDER BY name ASC')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'categories' => $categories, 'tags' => $tags]);
    exit;
}

// ─── POST : créer l'outil depuis une soumission ───────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Champs obligatoires
    $required = ['name', 'description', 'website_url', 'pricing_type', 'category_id'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "Champ requis : $field"]);
            exit;
        }
    }

    $name          = trim($data['name']);
    $description   = trim($data['description']);
    $website_url   = trim($data['website_url']);
    $pricing_type  = $data['pricing_type'];
    $category_id   = (int)$data['category_id'];
    $logo_url      = trim($data['logo_url']       ?? '');
    $tagline       = trim($data['tagline']         ?? '');
    $api_available = !empty($data['api_available']) ? 1 : 0;
    $is_new        = !empty($data['is_new'])        ? 1 : 0;
    $release_date  = !empty($data['release_date'])  ? $data['release_date'] : null;
    $admin_id      = (int)($data['admin_id']        ?? 0);
    $submission_id = (int)($data['submission_id']   ?? 0);

    // Plateformes
    $web     = !empty($data['is_available_web'])     ? 1 : 0;
    $windows = !empty($data['is_available_windows']) ? 1 : 0;
    $mac     = !empty($data['is_available_mac'])     ? 1 : 0;
    $ios     = !empty($data['is_available_ios'])     ? 1 : 0;
    $android = !empty($data['is_available_android']) ? 1 : 0;

    // Générer un slug unique
    $slug_base = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    $slug      = $slug_base;
    $suffix    = 1;
    while (true) {
        $check = $pdo->prepare('SELECT id FROM ai_tools WHERE slug = ?');
        $check->execute([$slug]);
        if (!$check->fetch()) break;
        $slug = $slug_base . '-' . $suffix++;
    }

    try {
        $pdo->beginTransaction();

        // Insérer l'outil
        $pdo->prepare("
            INSERT INTO ai_tools (
                name, slug, description, website_url, logo_url,
                pricing_type, categorie_principale_id,
                api_available, is_new, release_date,
                is_available_web, is_available_windows, is_available_mac,
                is_available_ios, is_available_android,
                validated_by, status, created_at
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, 'active', NOW()
            )
        ")->execute([
            $name, $slug, $description, $website_url, $logo_url ?: null,
            $pricing_type, $category_id,
            $api_available, $is_new, $release_date,
            $web, $windows, $mac, $ios, $android,
            $admin_id ?: null,
        ]);

        $tool_id = (int)$pdo->lastInsertId();

        // Associer les tags sélectionnés
        $tag_ids = $data['tag_ids'] ?? [];
        if (!empty($tag_ids)) {
            $ins = $pdo->prepare('INSERT IGNORE INTO tool_tags (tool_id, tag_id) VALUES (?, ?)');
            foreach ($tag_ids as $tid) {
                $ins->execute([$tool_id, (int)$tid]);
            }
        }

        // Si l'outil vient d'une soumission : marquer la soumission comme approuvée
        if ($submission_id) {
            $pdo->prepare("
                UPDATE submissions
                SET status = 'approved', reviewed_at = NOW(), admin_id = ?
                WHERE id = ?
            ")->execute([$admin_id ?: null, $submission_id]);

            // Notifier l'utilisateur
            $sub = $pdo->prepare('SELECT submitter_email FROM submissions WHERE id = ?');
            $sub->execute([$submission_id]);
            $row = $sub->fetch(PDO::FETCH_ASSOC);
            if ($row && $row['submitter_email']) {
                $user = $pdo->prepare('SELECT id FROM users WHERE email = ?');
                $user->execute([$row['submitter_email']]);
                $u = $user->fetch(PDO::FETCH_ASSOC);
                if ($u) {
                    $pdo->prepare("
                        INSERT INTO notifications (user_id, type, ref_id, statut, message_admin)
                        VALUES (?, 'soumission', ?, 'accepté',
                        'Votre soumission a été validée et l\'outil est maintenant visible sur AIRadar.')
                    ")->execute([$u['id'], $submission_id]);
                }
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'tool_id' => $tool_id]);

    } catch (Exception $e) {
        $pdo->rollBack();
        // Doublon sur name ou slug
        if (str_contains($e->getMessage(), 'Duplicate')) {
            http_response_code(409);
            echo json_encode(['success' => false, 'error' => 'Un outil avec ce nom existe déjà.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
    exit;
}