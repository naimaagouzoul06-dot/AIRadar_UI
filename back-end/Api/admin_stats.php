<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $stats = [];
    $stats['total_users']         = $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $stats['active_tools']        = $pdo->query('SELECT COUNT(*) FROM ai_tools WHERE status = "active"')->fetchColumn();
    $stats['pending_submissions'] = $pdo->query('SELECT COUNT(*) FROM submissions WHERE status = "pending"')->fetchColumn();
    $stats['pending_reports']     = $pdo->query('SELECT COUNT(*) FROM reports WHERE status = "pending"')->fetchColumn();
    $stats['total_reviews']       = $pdo->query('SELECT COUNT(*) FROM reviews')->fetchColumn();
    $stats['total_favorites']     = $pdo->query('SELECT COUNT(*) FROM favorites')->fetchColumn();
    $stats['total_searches']      = $pdo->query('SELECT COUNT(*) FROM history')->fetchColumn();

    $stats['recent_users'] = $pdo->query('
        SELECT id, name, email, status, created_at FROM users ORDER BY created_at DESC LIMIT 5
    ')->fetchAll(PDO::FETCH_ASSOC);

    $stats['recent_submissions'] = $pdo->query('
        SELECT id, tool_name, submitter_name, status, submitted_at FROM submissions ORDER BY submitted_at DESC LIMIT 5
    ')->fetchAll(PDO::FETCH_ASSOC);

    $stats['top_tools'] = $pdo->query('
        SELECT t.id, t.name, c.name AS category, COUNT(tv.id) AS views
        FROM ai_tools t
        JOIN categories c ON t.categorie_principale_id = c.id
        LEFT JOIN tool_views tv ON tv.tool_id = t.id
        WHERE t.status = "active"
        GROUP BY t.id
        ORDER BY views DESC
        LIMIT 10
    ')->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'stats' => $stats]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}