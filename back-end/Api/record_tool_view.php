<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['user_id'], $data['tool_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing data']);
    exit;
}
$user_id = (int)$data['user_id'];
$tool_id = (int)$data['tool_id'];
try {
    $stmt = $pdo->prepare("INSERT INTO tool_views (user_id, tool_id, viewed_at) VALUES (?, ?, NOW())");
    $stmt->execute([$user_id, $tool_id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}