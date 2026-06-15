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
    // On ne garde que les outils avec au moins une visite
    $stmt = $pdo->prepare("
        SELECT 
            t.id, t.name, t.website_url, t.logo_url,
            c.name as category, c.icon as category_icon,
            COUNT(v.id) as visits,
            MAX(v.viewed_at) as last_used
        FROM ai_tools t
        LEFT JOIN categories c ON t.categorie_principale_id = c.id
        INNER JOIN tool_views v ON v.tool_id = t.id AND v.user_id = ?
        GROUP BY t.id
        ORDER BY visits DESC
    ");
    $stmt->execute([$user_id]);
    $tools = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $colors = ['#10a37f','#0ea5e9','#e2e8f0','#6366f1','#f59e0b','#ec4899','#8b5cf6','#06b6d4'];
    foreach ($tools as &$tool) {
        $words = explode(' ', $tool['name']);
        $tool['initials'] = strtoupper(substr($words[0],0,1) . (isset($words[1]) ? substr($words[1],0,1) : substr($words[0],1,1)));
        $tool['color'] = $colors[abs(crc32($tool['name'])) % count($colors)];
        $tool['visits'] = (int)$tool['visits'];
        $tool['lastUsed'] = $tool['last_used'] ? date('Y-m-d H:i', strtotime($tool['last_used'])) : 'Never';
        $tool['website'] = $tool['website_url'] ?? '#';
        $tool['category'] = $tool['category'] ?? 'Uncategorized';
        unset($tool['website_url'], $tool['last_used']);
    }
    echo json_encode(['success' => true, 'tools' => $tools]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}