<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true);
$email    = trim($data['email']    ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

// Récupérer l'utilisateur avec tous les champs de suspension
$stmt = $pdo->prepare("
    SELECT id, name, email, password_hash, status, role,
           date_suspension, suspension_end
    FROM users
    WHERE email = ?
");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Email introuvable ou mot de passe incorrect
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    exit;
}

// ── Vérifier la suspension ─────────────────────────────────────────────────
if ($user['status'] === 'suspended') {

    // Suspension temporaire expirée → lever automatiquement
    if ($user['suspension_end'] !== null && strtotime($user['suspension_end']) <= time()) {
        $pdo->prepare("
            UPDATE users
            SET status = 'active', suspension_end = NULL
            WHERE id = ?
        ")->execute([$user['id']]);
        // Laisser passer la connexion ci-dessous
    } else {
        // Suspension encore active : construire un message précis
        if ($user['suspension_end']) {
            $fin = date('d/m/Y à H:i', strtotime($user['suspension_end']));
            $msg = "Votre compte est suspendu jusqu'au $fin.";
        } else {
            $msg = "Votre compte est suspendu définitivement. Contactez l'administration.";
        }
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => $msg, 'suspended' => true]);
        exit;
    }
}

// ── Connexion réussie ──────────────────────────────────────────────────────
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user'    => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
    ],
]);