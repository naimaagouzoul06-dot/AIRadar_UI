<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// ── Validation serveur ──
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d).{8,}$/', $password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password must be 8+ chars with letters and numbers']);
    exit;
}

// ── Vérifier si l'email existe déjà ──
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'error' => 'Email already in use']);
    exit;
}

// ── Insertion ──
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare('
    INSERT INTO users (name, email, password_hash, role, status, is_active)
    VALUES (?, ?, ?, "user", "active", TRUE)
');
$stmt->execute([$name, $email, $hash]);
$userId = $pdo->lastInsertId();

http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Account created successfully',
    'user'    => ['id' => $userId, 'name' => $name, 'email' => $email]
]);