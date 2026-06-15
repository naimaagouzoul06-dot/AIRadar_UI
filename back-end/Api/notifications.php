<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── GET : notifications d'un utilisateur ─────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = (int)($_GET['user_id'] ?? 0);
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'user_id requis']);
        exit;
    }
    $stmt = $pdo->prepare('
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    ');
    $stmt->execute([$user_id]);
    $notifs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'notifications' => $notifs]);
    exit;
}

// ─── POST : marquer tout comme lu ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data    = json_decode(file_get_contents('php://input'), true);
    $action  = $data['action']  ?? '';
    $user_id = (int)($data['user_id'] ?? 0);

    if ($action === 'mark_all_read' && $user_id) {
        $pdo->prepare('UPDATE notifications SET lu = TRUE WHERE user_id = ?')
            ->execute([$user_id]);
        echo json_encode(['success' => true]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Action invalide']);
    exit;
}