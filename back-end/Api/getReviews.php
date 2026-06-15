<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

$tool_id = isset($_GET['tool_id']) ? intval($_GET['tool_id']) : 0;
if (!$tool_id) {
    echo json_encode(['success' => false, 'error' => 'Missing tool_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT r.id, r.rating, r.comment, 
               DATE_FORMAT(r.created_at, '%Y-%m-%d') as created_at,
               COALESCE(u.name, 'Ancien utilisateur') as user_name,
               u.profile_url
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.tool_id = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$tool_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Nettoyage
    foreach ($reviews as &$rev) {
        $rev['rating'] = (int)$rev['rating'];
        $rev['comment'] = nl2br(htmlspecialchars($rev['comment']));
    }
    
    echo json_encode(['success' => true, 'reviews' => $reviews]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}