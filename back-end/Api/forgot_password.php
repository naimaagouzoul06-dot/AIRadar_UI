<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data   = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

// ACTION 1 : Demande de reset → vérifier email + générer token
if ($action === 'request') {

    $email = trim($data['email'] ?? '');

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }

    // Vérifier si l'email existe
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND status = "active"');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'No account found with this email address']);
        exit;
    }

    // Supprimer les anciens tokens de cet utilisateur
    $pdo->prepare('DELETE FROM password_resets WHERE user_id = ?')->execute([$user['id']]);

    // Générer un token sécurisé
    $token     = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $pdo->prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$user['id'], $token, $expiresAt]);

    // En production : envoyer le token par email
    // En local (XAMPP) : on le retourne directement dans la réponse
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Reset token generated',
        'token'   => $token   // ← Retirer en production
    ]);
    exit;
}

// ACTION 2 : Réinitialisation du mot de passe
if ($action === 'reset') {

    $token       = trim($data['token']        ?? '');
    $newPassword = $data['new_password'] ?? '';

    if (empty($token) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Token and new password are required']);
        exit;
    }

    // Validation du mot de passe
    if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d).{8,}$/', $newPassword)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Password must be 8+ chars with letters and numbers']);
        exit;
    }

    // Vérifier que le token est valide et non expiré
    $stmt = $pdo->prepare('
        SELECT user_id FROM password_resets
        WHERE token = ? AND expires_at > NOW() AND used = 0
    ');
    $stmt->execute([$token]);
    $reset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reset) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid or expired reset token']);
        exit;
    }

    // Mettre à jour le mot de passe
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        ->execute([$hash, $reset['user_id']]);

    // Marquer le token comme utilisé
    $pdo->prepare('UPDATE password_resets SET used = 1 WHERE token = ?')
        ->execute([$token]);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Password successfully updated']);
    exit;
}

// Action inconnue
http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown action']);