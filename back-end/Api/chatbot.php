
<?php
header('Access-Control-Allow-Origin: *');
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

$data     = json_decode(file_get_contents('php://input'), true);
$messages = $data['messages'] ?? [];

if (empty($messages)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Messages are required']);
    exit;
}

// ── Récupérer les outils depuis la base de données ──
try {
    $stmt = $pdo->query('
        SELECT t.name, t.description, t.pricing_type, t.website_url,
               c.name AS category
        FROM ai_tools t
        JOIN categories c ON t.categorie_principale_id = c.id
        WHERE t.status = "active"
        ORDER BY t.global_rating DESC
        LIMIT 30
    ');
    $tools = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $toolsList = '';
    foreach ($tools as $tool) {
        $toolsList .= "- {$tool['name']} ({$tool['category']}) : {$tool['description']} | Pricing: {$tool['pricing_type']} | URL: {$tool['website_url']}\n";
    }
} catch (Exception $e) {
    $toolsList = "Impossible de charger les outils.";
}

// ── System prompt ──
$systemPrompt = "Tu es l'assistant virtuel du site AI Radar, une plateforme qui répertorie et recommande les meilleurs outils d'intelligence artificielle.

Ton rôle est double :
1. Aider les utilisateurs à trouver l'outil AI le plus adapté à leurs besoins
2. Répondre aux questions sur le site AI Radar et ses fonctionnalités

Voici les outils AI disponibles sur notre site :
{$toolsList}

Règles importantes :
- Réponds toujours en français sauf si l'utilisateur écrit en anglais
- Sois concis et direct (max 3-4 phrases par réponse)
- Si tu recommandes un outil, mentionne son nom et pourquoi il correspond au besoin
- Si l'utilisateur demande quelque chose hors sujet, redirige-le vers les fonctionnalités du site
- Ne jamais inventer des outils qui ne sont pas dans la liste fournie
- Utilise un ton amical et professionnel
- Pour les questions sur le site : AI Radar permet de découvrir, comparer et sauvegarder des outils AI, avec un système de favoris, d'historique de recherche, et de soumission de nouveaux outils";

// ── Préparer les messages pour Groq ──
// Groq utilise le même format qu'OpenAI (role: user/assistant/system)
$groqMessages = [];

// Ajouter le system prompt
$groqMessages[] = [
    'role'    => 'system',
    'content' => $systemPrompt,
];

// Ajouter les messages de la conversation
foreach ($messages as $msg) {
    if ($msg['role'] === 'user') {
        $groqMessages[] = [
            'role'    => 'user',
            'content' => $msg['content'],
        ];
    } elseif ($msg['role'] === 'assistant') {
        $groqMessages[] = [
            'role'    => 'assistant',
            'content' => $msg['content'],
        ];
    }
}

// ── Clé API Groq ──
$GROQ_API_KEY = import.meta.env.VITE_API_KEY; // ← remplace ici

// ── Appel à l'API Groq ──
$payload = json_encode([
    'model'       => 'llama-3.3-70b-versatile',
    'messages'    => $groqMessages,
    'max_tokens'  => 500,
    'temperature' => 0.7,
]);

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $GROQ_API_KEY,
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($httpCode !== 200) {
    echo json_encode([
        'success' => false,
        'error'   => 'Groq API error: ' . $httpCode,
        'detail'  => json_decode($response, true),
    ]);
    exit;
}

$result = json_decode($response, true);
$reply  = $result['choices'][0]['message']['content']
       ?? 'Désolé, je ne peux pas répondre pour le moment.';

echo json_encode([
    'success' => true,
    'reply'   => $reply,
]);