<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';
$data = json_decode(file_get_contents('php://input'), true);
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
    exit;
}
try {
    $pdo->prepare("DELETE FROM history WHERE user_id = ?")->execute([$user_id]);
    $pdo->prepare("DELETE FROM tool_views WHERE user_id = ?")->execute([$user_id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}