<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
    exit;
}

try {
    // Requête corrigée : on ne prend QUE la table history, pas les outils
    $stmt = $pdo->prepare("
        SELECT 
            h.id, 
            h.query_text, 
            h.searched_at,
            c.name as category,
            c.icon as category_icon
        FROM history h
        LEFT JOIN categories c ON h.categorie_id = c.id
        WHERE h.user_id = ?
        ORDER BY h.searched_at DESC
    ");
    $stmt->execute([$user_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sessions = [];
    $now = new DateTime();
    foreach ($rows as $row) {
        $date = new DateTime($row['searched_at']);
        $diff = $now->diff($date)->days;
        if ($diff == 0) $group = 'Today';
        elseif ($diff == 1) $group = 'Yesterday';
        elseif ($diff <= 7) $group = 'This Week';
        else $group = 'Older';

        $sessions[] = [
            'id' => $row['id'],
            'title' => $row['query_text'],                 // le texte recherché
            'category' => $row['category'] ?? 'General',
            'category_icon' => $row['category_icon'] ?? '🔍',
            'time' => $date->format('Y-m-d H:i'),
            'group' => $group,
            // pas de nom d'outil, pas de visites
        ];
    }
    echo json_encode(['success' => true, 'sessions' => $sessions]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}