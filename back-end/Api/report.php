<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

$user_id = isset($data['user_id']) ? (int)$data['user_id'] : 0;
$tool_id = isset($data['tool_id']) ? (int)$data['tool_id'] : null;
$comment_id = isset($data['comment_id']) ? (int)$data['comment_id'] : null;
$reason = trim($data['reason'] ?? '');

if (!$user_id || !$reason) {
    echo json_encode(['success' => false, 'error' => 'Missing user_id or reason']);
    exit;
}
if (!$tool_id && !$comment_id) {
    echo json_encode(['success' => false, 'error' => 'Specify either tool_id or comment_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO reports (user_id, tool_id, comment_id, reason, status) VALUES (?, ?, ?, ?, 'pending')");
    $stmt->execute([$user_id, $tool_id, $comment_id, $reason]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}