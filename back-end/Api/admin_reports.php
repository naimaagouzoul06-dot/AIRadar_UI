<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── GET : liste des signalements ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? 'pending';

    $where = ($status !== 'all') ? 'WHERE r.status = :status' : '';

    $sql = "
        SELECT
            r.id,
            r.reason,
            r.status,
            r.created_at,
            r.admin_response,
            r.responded_at,
            r.tool_id,
            r.comment_id,
            u.name  AS reporter_name,
            u.email AS reporter_email,
            t.name  AS tool_name,
            rv.comment AS reported_comment,
            rv_user.name AS comment_author
        FROM reports r
        LEFT JOIN users  u       ON u.id  = r.user_id
        LEFT JOIN ai_tools t     ON t.id  = r.tool_id
        LEFT JOIN reviews  rv    ON rv.id = r.comment_id
        LEFT JOIN users    rv_user ON rv_user.id = rv.user_id
        $where
        ORDER BY r.created_at DESC
    ";

    if ($status !== 'all') {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':status' => $status]);
    } else {
        $stmt = $pdo->query($sql);
    }

    echo json_encode(['success' => true, 'reports' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

// ─── POST : reviewed / rejected ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data          = json_decode(file_get_contents('php://input'), true);
    $action        = $data['action']        ?? '';
    $id            = (int)($data['report_id'] ?? 0);
    $admin_message = trim($data['admin_message'] ?? '');

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Report ID required']);
        exit;
    }

    $allowed = ['reviewed', 'rejected'];
    if (!in_array($action, $allowed)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
        exit;
    }

    // Mettre à jour le statut + réponse admin
    $pdo->prepare('
        UPDATE reports
        SET status = ?, admin_response = ?, responded_at = NOW()
        WHERE id = ?
    ')->execute([$action, $admin_message ?: null, $id]);

    // Récupérer le signalement pour notifier l'utilisateur
    $rep = $pdo->prepare('SELECT * FROM reports WHERE id = ?');
    $rep->execute([$id]);
    $report = $rep->fetch(PDO::FETCH_ASSOC);

    if ($report && $report['user_id']) {
        if ($action === 'reviewed') {
            $statut_notif = 'traité';
            $message = "Votre signalement a été examiné et pris en compte par l'équipe AIRadar.";
        } else {
            $statut_notif = 'refusé';
            $message = "Votre signalement n'a pas été retenu après examen.";
        }
        if ($admin_message) $message .= " — $admin_message";

        $pdo->prepare('
            INSERT INTO notifications (user_id, type, ref_id, statut, message_admin)
            VALUES (?, "signalement", ?, ?, ?)
        ')->execute([$report['user_id'], $id, $statut_notif, $message]);
    }

    echo json_encode(['success' => true]);
    exit;
}