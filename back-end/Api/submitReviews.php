<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$required = ['user_id', 'tool_id', 'rating', 'comment'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing field: $field"]);
        exit;
    }
}

$user_id = (int)$data['user_id'];
$tool_id = (int)$data['tool_id'];
$rating = (int)$data['rating'];
$comment = trim($data['comment']);

if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'error' => 'Rating must be 1-5']);
    exit;
}
if ($comment === '') {
    echo json_encode(['success' => false, 'error' => 'Comment cannot be empty']);
    exit;
}

try {
    // Vérifier si l'utilisateur existe
    $userCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userCheck->execute([$user_id]);
    if (!$userCheck->fetch()) {
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }

    // Vérifier si l'outil existe
    $toolCheck = $pdo->prepare("SELECT id FROM ai_tools WHERE id = ?");
    $toolCheck->execute([$tool_id]);
    if (!$toolCheck->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Tool not found']);
        exit;
    }

    // Vérifier si l'utilisateur a déjà commenté
    $stmt = $pdo->prepare("SELECT id FROM reviews WHERE user_id = ? AND tool_id = ?");
    $stmt->execute([$user_id, $tool_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $pdo->prepare("UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?");
        $update->execute([$rating, $comment, $existing['id']]);
    } else {
        $insert = $pdo->prepare("INSERT INTO reviews (user_id, tool_id, rating, comment) VALUES (?, ?, ?, ?)");
        $insert->execute([$user_id, $tool_id, $rating, $comment]);
    }

    // Mettre à jour la note moyenne dans ai_tools
    $avg = $pdo->prepare("UPDATE ai_tools SET global_rating = (SELECT ROUND(AVG(rating),1) FROM reviews WHERE tool_id = ?) WHERE id = ?");
    $avg->execute([$tool_id, $tool_id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB error: ' . $e->getMessage()]);
}