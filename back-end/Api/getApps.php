<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type');

header('Content-Type: application/json');



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }



require_once '../config/db.php';



try {

    $stmt = $pdo->query('

        SELECT

            t.id,

            t.name,

            t.slug,

            t.description,

            t.website_url,

            t.logo_url,

            t.pricing_type,

            t.is_new,

            t.api_available,

            t.is_available_web,

            t.is_available_windows,

            t.is_available_mac,

            t.is_available_ios,

            t.is_available_android,

            t.supported_languages,

            t.free_plan_details,

            t.pro_plan_details,

            t.integrations,

            t.release_date,

            c.name  AS category,

            c.icon  AS category_icon,

            co.name AS company_name,

            co.country AS company_country,

            -- ✅ Rating calculé depuis reviews

            COALESCE(ROUND(AVG(r.rating), 1), t.global_rating) AS global_rating,

            COUNT(r.id) AS review_count

        FROM ai_tools t

        JOIN categories c  ON t.categorie_principale_id = c.id

        LEFT JOIN companies co ON t.company_id = co.id

        LEFT JOIN reviews r    ON r.tool_id = t.id

        WHERE t.status = "active"

        GROUP BY t.id

        ORDER BY global_rating DESC

    ');



    $tools = $stmt->fetchAll(PDO::FETCH_ASSOC);



    foreach ($tools as &$tool) {

        $tool['is_new']          = (bool) $tool['is_new'];

        $tool['api_available']   = (bool) $tool['api_available'];

        $tool['is_available_web']     = (bool) $tool['is_available_web'];

        $tool['is_available_windows'] = (bool) $tool['is_available_windows'];

        $tool['is_available_mac']     = (bool) $tool['is_available_mac'];

        $tool['is_available_ios']     = (bool) $tool['is_available_ios'];

        $tool['is_available_android'] = (bool) $tool['is_available_android'];

        $tool['global_rating']   = (float) $tool['global_rating'];

        $tool['review_count']    = (int)   $tool['review_count'];



        // Initiales depuis le nom

        $words = explode(' ', $tool['name']);

        $tool['initials'] = strtoupper(

            substr($words[0], 0, 1) .

            (isset($words[1]) ? substr($words[1], 0, 1) : substr($words[0], 1, 1))

        );



        // Couleur unique par outil

        $colors = ['#6366f1','#10a37f','#0ea5e9','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#84cc16','#f97316','#14b8a6'];

        $tool['color'] = $colors[abs(crc32($tool['name'])) % count($colors)];

    }



    echo json_encode(['success' => true, 'tools' => $tools]);



} catch (Exception $e) {

    http_response_code(500);

    echo json_encode(['success' => false, 'error' => 'Server error']);

}