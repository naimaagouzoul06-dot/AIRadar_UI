<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once '../config/db.php';

// ─── GET : liste des soumissions ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? 'pending';

    if ($status === 'all') {
        $stmt = $pdo->query('
            SELECT s.*, u.name AS submitter_name
            FROM submissions s
            LEFT JOIN users u ON s.submitter_email = u.email
            ORDER BY s.submitted_at DESC
        ');
    } else {
        $stmt = $pdo->prepare('
            SELECT s.*, u.name AS submitter_name
            FROM submissions s
            LEFT JOIN users u ON s.submitter_email = u.email
            WHERE s.status = ?
            ORDER BY s.submitted_at DESC
        ');
        $stmt->execute([$status]);
    }
    echo json_encode(['success' => true, 'submissions' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

// ─── Auto-créer les colonnes manquantes si ALTER non exécuté ──────────────
$cols = ['admin_id', 'rejection_reason', 'rejection_comment', 'reviewed_at'];
foreach ($cols as $col) {
    try {
        $exists = $pdo->query("
            SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = 'submissions'
              AND COLUMN_NAME  = '$col'
        ")->fetchColumn();
        if (!$exists) {
            if ($col === 'admin_id')
                $pdo->exec("ALTER TABLE submissions ADD COLUMN admin_id INT DEFAULT NULL");
            elseif ($col === 'rejection_reason')
                $pdo->exec("ALTER TABLE submissions ADD COLUMN rejection_reason VARCHAR(100) DEFAULT NULL");
            elseif ($col === 'rejection_comment')
                $pdo->exec("ALTER TABLE submissions ADD COLUMN rejection_comment TEXT DEFAULT NULL");
            elseif ($col === 'reviewed_at')
                $pdo->exec("ALTER TABLE submissions ADD COLUMN reviewed_at TIMESTAMP NULL DEFAULT NULL");
        }
    } catch (Exception $e) { /* ignore */ }
}

// ─── POST : approve / reject ───────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data     = json_decode(file_get_contents('php://input'), true);
    $action   = $data['action']          ?? '';
    $id       = (int)($data['submission_id'] ?? 0);
    $admin_id = (int)($data['admin_id']   ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID requis']);
        exit;
    }

    // ── APPROVE ─────────────────────────────────────────────────────────────
    if ($action === 'approve') {
        $pdo->prepare('
            UPDATE submissions
            SET status = "approved", reviewed_at = NOW(), admin_id = ?
            WHERE id = ?
        ')->execute([$admin_id ?: null, $id]);

        // Récupérer user lié à cette soumission
        $sub = $pdo->prepare('SELECT submitter_email FROM submissions WHERE id = ?');
        $sub->execute([$id]);
        $row = $sub->fetch(PDO::FETCH_ASSOC);

        if ($row && $row['submitter_email']) {
            $user = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $user->execute([$row['submitter_email']]);
            $u = $user->fetch(PDO::FETCH_ASSOC);

            if ($u) {
                $pdo->prepare('
                    INSERT INTO notifications (user_id, type, ref_id, statut, message_admin)
                    VALUES (?, "soumission", ?, "accepté",
                    "Votre soumission a été validée et l\'outil est maintenant visible sur AIRadar.")
                ')->execute([$u['id'], $id]);
            }
        }

        echo json_encode(['success' => true]);
    }

    // ── REJECT ──────────────────────────────────────────────────────────────
    elseif ($action === 'reject') {
        // Support two formats:
        // 1) rejection_reason + rejection_comment (legacy backend format)
        // 2) admin_message (format sent by frontend)
        $reason  = $data['rejection_reason']  ?? null;
        $comment = $data['rejection_comment'] ?? null;
        $admin_message = trim($data['admin_message'] ?? '');

        // If frontend sends admin_message, parse it
        if (!$reason && $admin_message) {
            // Format from frontend: "Raison : <reason>\nCommentaire : <comment>"
            if (preg_match('/^Raison\s*:\s*(.+?)(?:\n|$)/u', $admin_message, $m)) {
                $reason = trim($m[1]);
            }
            if (preg_match('/Commentaire\s*:\s*(.+)$/us', $admin_message, $m)) {
                $comment = trim($m[1]);
            }
            // Fallback: use admin_message as reason directly
            if (!$reason) $reason = $admin_message;
        }

        $allowed = [
            'Informations incorrectes',
            'Outil déjà existant',
            'Lien invalide',
            'Catégorie incorrecte',
            'Contenu inapproprié',
        ];

        // Accept any non-empty reason (in case admin_message format differs)
        if (!$reason) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Raison de refus requise']);
            exit;
        }

        // Mettre à jour la soumission
        $pdo->prepare('
            UPDATE submissions
            SET status = "rejected",
                reviewed_at = NOW(),
                admin_id = ?,
                rejection_reason = ?,
                rejection_comment = ?
            WHERE id = ?
        ')->execute([$admin_id ?: null, $reason, $comment, $id]);

        // Récupérer l'utilisateur lié
        $sub = $pdo->prepare('SELECT submitter_email FROM submissions WHERE id = ?');
        $sub->execute([$id]);
        $row = $sub->fetch(PDO::FETCH_ASSOC);

        if ($row && $row['submitter_email']) {
            $user = $pdo->prepare('SELECT id, nb_refus, status FROM users WHERE email = ?');
            $user->execute([$row['submitter_email']]);
            $u = $user->fetch(PDO::FETCH_ASSOC);

            if ($u) {
                $nb_refus = $u['nb_refus'] + 1;

                $msg = "Raison : $reason";
                if ($comment) $msg .= " — $comment";

                if ($nb_refus >= 3) {
                    $pdo->prepare('
                        UPDATE users
                        SET nb_refus = ?, status = "suspended", date_suspension = NOW()
                        WHERE id = ?
                    ')->execute([$nb_refus, $u['id']]);
                    $msg .= " ⚠ Votre compte a été suspendu après 3 refus.";
                } else {
                    $restantes = 3 - $nb_refus;
                    $pdo->prepare('UPDATE users SET nb_refus = ? WHERE id = ?')
                        ->execute([$nb_refus, $u['id']]);
                    $msg .= " ⚠ Il vous reste $restantes tentative(s) avant suspension.";
                }

                // Créer notification refus
                $pdo->prepare('
                    INSERT INTO notifications (user_id, type, ref_id, statut, message_admin)
                    VALUES (?, "soumission", ?, "refusé", ?)
                ')->execute([$u['id'], $id, $msg]);
            }
        }

        echo json_encode(['success' => true]);
    }

    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Action inconnue']);
    }
    exit;
}