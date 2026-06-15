<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('
        SELECT c.id, c.name, c.icon,
               COUNT(t.id) AS tools_count
        FROM categories c
        LEFT JOIN ai_tools t ON t.categorie_principale_id = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
    ');
    echo json_encode(['success' => true, 'categories' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    if ($action === 'add') {
        $name = trim($data['name'] ?? '');
        $icon = trim($data['icon'] ?? '');
        if (!$name) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Name required']); exit; }
        $pdo->prepare('INSERT INTO categories (name, icon) VALUES (?, ?)')->execute([$name, $icon]);
        echo json_encode(['success' => true]);
    } elseif ($action === 'delete') {
        $id = (int)($data['category_id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'ID required']); exit; }
        $pdo->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400); echo json_encode(['success'=>false,'error'=>'Unknown action']);
    }
    exit;
}