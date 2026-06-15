<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type = $_GET['type'] ?? 'tags';

    // Retourner tous les tags
    if ($type === 'tags') {
        $tags = $pdo->query('
            SELECT t.id, t.name, COUNT(tt.tool_id) AS tool_count
            FROM tags t
            LEFT JOIN tool_tags tt ON t.id = tt.tag_id
            GROUP BY t.id, t.name
            ORDER BY t.name ASC
        ')->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'tags' => $tags]);
    }

    // Retourner tous les outils AI (pour le select)
    elseif ($type === 'tools') {
        $tools = $pdo->query('
            SELECT id, name FROM ai_tools
            WHERE status = "active"
            ORDER BY name ASC
        ')->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'tools' => $tools]);
    }

    // Retourner les tags déjà associés à un outil
    elseif ($type === 'tool_tags') {
        $tool_id = (int)($_GET['tool_id'] ?? 0);
        if (!$tool_id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'tool_id requis']); exit; }
        $stmt = $pdo->prepare('
            SELECT t.id, t.name FROM tags t
            INNER JOIN tool_tags tt ON t.id = tt.tag_id
            WHERE tt.tool_id = ?
            ORDER BY t.name ASC
        ');
        $stmt->execute([$tool_id]);
        echo json_encode(['success' => true, 'tags' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    // Ajouter un tag
    if ($action === 'add') {
        $name = trim($data['name'] ?? '');
        if (!$name) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Name required']); exit; }
        try {
            $pdo->prepare('INSERT INTO tags (name) VALUES (?)')->execute([$name]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(409); echo json_encode(['success'=>false,'error'=>'Tag already exists']);
        }
    }

    // Supprimer un tag
    elseif ($action === 'delete') {
        $id = (int)($data['tag_id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'ID required']); exit; }
        $pdo->prepare('DELETE FROM tags WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);
    }

    // Associer un tag à un outil
    elseif ($action === 'attach') {
        $tool_id = (int)($data['tool_id'] ?? 0);
        $tag_id  = (int)($data['tag_id']  ?? 0);
        if (!$tool_id || !$tag_id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'tool_id et tag_id requis']); exit; }
        try {
            $pdo->prepare('INSERT IGNORE INTO tool_tags (tool_id, tag_id) VALUES (?, ?)')->execute([$tool_id, $tag_id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500); echo json_encode(['success'=>false,'error'=>'Erreur BD']);
        }
    }

    // Dissocier un tag d'un outil
    elseif ($action === 'detach') {
        $tool_id = (int)($data['tool_id'] ?? 0);
        $tag_id  = (int)($data['tag_id']  ?? 0);
        if (!$tool_id || !$tag_id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'tool_id et tag_id requis']); exit; }
        $pdo->prepare('DELETE FROM tool_tags WHERE tool_id = ? AND tag_id = ?')->execute([$tool_id, $tag_id]);
        echo json_encode(['success' => true]);
    }

    else {
        http_response_code(400); echo json_encode(['success'=>false,'error'=>'Unknown action']);
    }
    exit;
}