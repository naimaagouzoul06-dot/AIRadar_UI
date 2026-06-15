<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

$stmt = $pdo->query('SELECT id, name, icon FROM categories ORDER BY name ASC');
echo json_encode(['success' => true, 'categories' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);