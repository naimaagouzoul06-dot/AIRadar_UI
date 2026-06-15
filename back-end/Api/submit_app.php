<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

// Le frontend envoie FormData (multipart) → lire $_POST et $_FILES
// (pas json_decode — c'est la cause du bug "Invalid JSON")
$name             = trim($_POST['name']             ?? '');
$website          = trim($_POST['website_url']      ?? '');
$tagline          = trim($_POST['tagline']           ?? '');
$description      = trim($_POST['description']       ?? '');
$pricing          = trim($_POST['pricing_type']      ?? '');
$category_id      = (int)($_POST['categorie_principale_id'] ?? 0);
$api_available    = $_POST['api_available']          ?? 'false';
$submitter_name   = trim($_POST['submitterName']     ?? '');
$submitter_email  = trim($_POST['submitterEmail']    ?? '');
$notes            = trim($_POST['integrations']      ?? '');
$new_cat          = trim($_POST['new_category_name'] ?? '');

// ── Validation ──────────────────────────────────────────────────────────────
if (!$name)        { echo json_encode(['success'=>false,'error'=>'Tool name is required']);   exit; }
if (!$website)     { echo json_encode(['success'=>false,'error'=>'Website URL is required']); exit; }
if (!$description) { echo json_encode(['success'=>false,'error'=>'Description is required']); exit; }
if (!$pricing)     { echo json_encode(['success'=>false,'error'=>'Pricing type is required']); exit; }

if (!$category_id && !$new_cat) {
    echo json_encode(['success'=>false,'error'=>'Please select or add a category']);
    exit;
}

if ($submitter_email && !filter_var($submitter_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success'=>false,'error'=>'Invalid email format']);
    exit;
}

// ── Catégorie ────────────────────────────────────────────────────────────────
// Si nouvelle catégorie saisie, l'ajouter et récupérer son ID
if ($new_cat && !$category_id) {
    try {
        $pdo->prepare('INSERT INTO categories (name) VALUES (?)')->execute([$new_cat]);
        $category_id = (int)$pdo->lastInsertId();
    } catch (Exception $e) {
        // Doublon : récupérer l'existante
        $r = $pdo->prepare('SELECT id FROM categories WHERE name = ?');
        $r->execute([$new_cat]);
        $row = $r->fetch(PDO::FETCH_ASSOC);
        if ($row) $category_id = $row['id'];
    }
}

// La colonne "category" dans submissions attend du JSON (selon le schéma)
// On stocke le nom de la catégorie sous forme de tableau JSON
$cat_name_row = $pdo->prepare('SELECT name FROM categories WHERE id = ?');
$cat_name_row->execute([$category_id]);
$cat_row   = $cat_name_row->fetch(PDO::FETCH_ASSOC);
$category_json = json_encode($cat_row ? [$cat_row['name']] : []);

// ── Upload logo (optionnel) ──────────────────────────────────────────────────
$logo_path = null;
if (!empty($_FILES['logo']['tmp_name'])) {
    $upload_dir = '../uploads/logos/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

    $ext      = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
    $filename = 'logo_' . time() . '_' . rand(1000,9999) . '.' . strtolower($ext);
    $dest     = $upload_dir . $filename;

    $allowed = ['jpg','jpeg','png','svg','webp','gif'];
    if (in_array(strtolower($ext), $allowed) && move_uploaded_file($_FILES['logo']['tmp_name'], $dest)) {
        $logo_path = 'uploads/logos/' . $filename;
    }
}

// ── Insertion ────────────────────────────────────────────────────────────────
try {
    $stmt = $pdo->prepare("
        INSERT INTO submissions
            (tool_name, website, tagline, description, category, pricing,
             api_available, logo_path, submitter_name, submitter_email,
             notes, status, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    $stmt->execute([
        $name,
        $website,
        $tagline ?: '',
        $description,
        $category_json,
        $pricing,
        $api_available,
        $logo_path,
        $submitter_name,
        $submitter_email,
        $notes,
    ]);

    echo json_encode(['success' => true, 'submission_id' => (int)$pdo->lastInsertId()]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur base de données : ' . $e->getMessage()]);
}