<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── S'assurer que la colonne suspension_end existe ───────────────────────
try {
    $col = $pdo->query("
        SELECT COUNT(*) FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME   = 'users'
          AND COLUMN_NAME  = 'suspension_end'
    ")->fetchColumn();
    if (!$col) {
        $pdo->exec("ALTER TABLE users ADD COLUMN suspension_end TIMESTAMP NULL DEFAULT NULL");
    }
} catch (Exception $e) { /* ignore */ }

// ─── GET : liste des utilisateurs ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Auto-lever les suspensions expirées avant de retourner la liste
    $pdo->exec("
        UPDATE users
        SET status = 'active', suspension_end = NULL
        WHERE status = 'suspended'
          AND suspension_end IS NOT NULL
          AND suspension_end <= NOW()
    ");

    $users = $pdo->query("
        SELECT id, name, email, role, status, nb_refus,
               date_suspension, suspension_end, created_at
        FROM users
        ORDER BY created_at DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'users' => $users]);
    exit;
}

// ─── POST ──────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = json_decode(file_get_contents('php://input'), true);
    $action = $data['action']  ?? '';
    $uid    = (int)($data['user_id'] ?? 0);

    if (!$uid) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID required']);
        exit;
    }

    // ── SUSPEND avec durée ─────────────────────────────────────────────────
    if ($action === 'suspend') {
        $duration = $data['duration'] ?? 'permanent'; // '1d','3d','7d','14d','30d','permanent'
        $reason   = trim($data['reason'] ?? '');

        // Calculer la date de fin de suspension
        $suspension_end = null;
        $durations = [
            '1d'  => '+1 day',
            '3d'  => '+3 days',
            '7d'  => '+7 days',
            '14d' => '+14 days',
            '30d' => '+30 days',
            '90d' => '+90 days',
        ];

        if (isset($durations[$duration])) {
            $suspension_end = date('Y-m-d H:i:s', strtotime($durations[$duration]));
        }
        // Si 'permanent' → suspension_end reste NULL

        $pdo->prepare("
            UPDATE users
            SET status          = 'suspended',
                date_suspension = NOW(),
                suspension_end  = ?
            WHERE id = ?
        ")->execute([$suspension_end, $uid]);

        // Notifier l'utilisateur (si table notifications existe)
        try {
            $durationLabel = [
                '1d'  => '1 jour',
                '3d'  => '3 jours',
                '7d'  => '7 jours',
                '14d' => '14 jours',
                '30d' => '30 jours',
                '90d' => '90 jours',
            ];
            $label = $durationLabel[$duration] ?? 'une durée indéfinie';
            $msg   = "Votre compte a été suspendu pour $label.";
            if ($reason) $msg .= " Raison : $reason";
            if ($suspension_end) $msg .= " Fin de suspension : " . date('d/m/Y à H:i', strtotime($suspension_end)) . ".";

            $pdo->prepare("
                INSERT INTO notifications (user_id, type, ref_id, statut, message_admin)
                VALUES (?, 'soumission', 0, 'refusé', ?)
            ")->execute([$uid, $msg]);
        } catch (Exception $e) { /* notifications optionnelles */ }

        echo json_encode([
            'success'        => true,
            'suspension_end' => $suspension_end,
        ]);
    }

    // ── REACTIVATE ─────────────────────────────────────────────────────────
    elseif ($action === 'reactivate') {
        $pdo->prepare("
            UPDATE users
            SET status = 'active', suspension_end = NULL, nb_refus = 0
            WHERE id = ?
        ")->execute([$uid]);
        echo json_encode(['success' => true]);
    }

    // ── DELETE ─────────────────────────────────────────────────────────────
    elseif ($action === 'delete') {
        $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$uid]);
        echo json_encode(['success' => true]);
    }

    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
    }
    exit;
}