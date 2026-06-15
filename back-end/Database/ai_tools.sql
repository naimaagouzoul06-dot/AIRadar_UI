-- =========================================================
-- SYSTEM CONFIGURATION & DATABASE CREATION
-- =========================================================
CREATE DATABASE IF NOT EXISTS AIRadar
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE AIRadar;

-- =========================================================
-- 1. TABLE : USERS
-- =========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_url VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. TABLE : CATEGORIES
-- =========================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 3. TABLE : COMPANIES
-- =========================================================
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    website VARCHAR(255),
    country VARCHAR(100),
    logo_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. TABLE CENTRAL : AI_TOOLS
-- =========================================================
CREATE TABLE ai_tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_principale_id INT NOT NULL, 
    company_id INT DEFAULT NULL,          
    created_by INT DEFAULT NULL,          
    validated_by INT DEFAULT NULL,        
    
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    website_url VARCHAR(255),
    logo_url VARCHAR(255) DEFAULT NULL,   
    
    pricing_type ENUM('free', 'freemium', 'paid', 'enterprise') DEFAULT 'freemium',
    global_rating DECIMAL(2,1) DEFAULT 0.0, 
    
    release_date DATE,
    is_new BOOLEAN DEFAULT FALSE,
    api_available BOOLEAN DEFAULT FALSE,
    
    is_available_web BOOLEAN DEFAULT TRUE,
    is_available_windows BOOLEAN DEFAULT FALSE,
    is_available_mac BOOLEAN DEFAULT FALSE,
    is_available_ios BOOLEAN DEFAULT FALSE,
    is_available_android BOOLEAN DEFAULT FALSE,
    
    supported_languages VARCHAR(255),
    free_plan_details VARCHAR(255),
    pro_plan_details VARCHAR(255),
    integrations TEXT,
    
    status ENUM('pending', 'active', 'inactive', 'rejected') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (categorie_principale_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================
-- 5. TABLE : TAGS
-- =========================================================
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================================
-- 6. TABLE DE LIAISON : TOOL_TAGS
-- =========================================================
CREATE TABLE tool_tags (
    tool_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (tool_id, tag_id),
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- =========================================================
-- 7. TABLE : REVIEWS
-- =========================================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), 
    comment TEXT DEFAULT NULL,                          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (user_id, tool_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE
);

-- =========================================================
-- 8. TABLE : FAVORITES
-- =========================================================
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, tool_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE
);

-- =========================================================
-- 9. TABLE : HISTORY
-- =========================================================
CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query_text VARCHAR(255),
    categorie_id INT DEFAULT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================================================
-- 10. TABLE : REPORTS
-- =========================================================
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,          
    tool_id INT DEFAULT NULL,      
    comment_id INT DEFAULT NULL,   -- Pointera sur l'id de la table reviews
    reason VARCHAR(255) NOT NULL,
    status ENUM('pending', 'reviewed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES reviews(id) ON DELETE CASCADE -- Correction ici
);

-- =========================================================
-- 11. TABLE : ADMIN_LOGS (Version Épurée Optimisée)
-- =========================================================
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type ENUM(
        'VALIDATE_AI', 
        'REJECT_AI', 
        'UPDATE_AI', 
        'DELETE_REVIEW', 
        'SUSPEND_USER', 
        'REACTIVATE_USER'
    ) NOT NULL,
    target_type ENUM('users', 'ai_tools', 'reviews') NOT NULL, 
    target_id INT DEFAULT NULL, 
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);





CREATE TABLE IF NOT EXISTS tool_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE,
    INDEX idx_user_tool (user_id, tool_id)
);




CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_name VARCHAR(150) NOT NULL,
    website VARCHAR(255) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category JSON NOT NULL,          -- tableau des catégories sélectionnées
    pricing VARCHAR(20) NOT NULL,
    api_available VARCHAR(20),
    logo_path VARCHAR(255),          -- chemin du fichier uploadé
    submitter_name VARCHAR(100),
    submitter_email VARCHAR(200),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);



-- ============================================================================
-- RÔLES ET MATRICE DES PERMISSIONS (POLITIQUE DE SÉCURITÉ DE XPLOREIA)
-- ============================================================================
-- 
-- 1. SUPER_ADMIN ('super_admin') :
--    - Rôle : Propriétaire ou administrateur principal du système.
--    - Droits : Accès absolu (Toutes les permissions à TRUE).
--    - Spécificité : C'est le seul profil autorisé à promouvoir un utilisateur 
--      en administrateur ou à modifier les privilèges d'autres admins.
--
-- 2. MANAGER ('manager') :
--    - Rôle : Gestionnaire de contenu et responsable de la plateforme.
--    - Droits : can_validate_ai, can_edit_ai, can_delete_review, can_manage_users.
--    - Spécificité : Il gère les fiches techniques des outils, valide les propositions,
--      modère les avis et peut suspendre des utilisateurs perturbateurs. Il ne peut
--      en revanche pas toucher à la structure de l'équipe d'administration.
--
-- 3. MODERATOR ('moderator') :
--    - Rôle : Agent de modération de premier niveau (Rôle par défaut).
--    - Droits : can_validate_ai, can_delete_review.
--    - Spécificité : Il s'occupe principalement de traiter les rapports (`reports`) :
--      il valide/rejette les nouveaux outils IA soumis et supprime les commentaires
--      abusifs ou inappropriés.
--
-- ============================================================================

-- ============================================================================
-- 12. TABLE : ADMINS (Extension de sécurité de la table 'users')
-- ============================================================================
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    
    -- Niveau hiérarchique principal de l'administrateur
    admin_level ENUM('super_admin', 'manager', 'moderator') DEFAULT 'moderator',
    
    -- Flags booléens pour le contrôle granulaire des droits applicatifs
    can_validate_ai    BOOLEAN DEFAULT FALSE, -- Valider/Rejeter les propositions d'IA (Status pending -> active/rejected)
    can_edit_ai        BOOLEAN DEFAULT FALSE, -- Modifier les informations d'une fiche IA existante
    can_delete_review  BOOLEAN DEFAULT FALSE, -- Supprimer un avis utilisateur suite à un signalement (Report)
    can_manage_users   BOOLEAN DEFAULT FALSE, -- Suspendre (Ban) ou réactiver un compte utilisateur standard
    can_manage_admins  BOOLEAN DEFAULT FALSE, -- Ajouter, révoquer ou modifier les droits d'un autre administrateur
    
    last_login TIMESTAMP NULL DEFAULT NULL,   -- Traçabilité de la dernière connexion au Panel Admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Sécurité : Si l'utilisateur est supprimé de la table 'users', son profil admin disparaît automatiquement
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- =========================================================
-- PERFORMANCE INDEXES
-- =========================================================
CREATE INDEX idx_tool_name ON ai_tools(name);
CREATE INDEX idx_tool_slug ON ai_tools(slug);
CREATE INDEX idx_tool_category ON ai_tools(categorie_principale_id); -- Correction ici
CREATE INDEX idx_tool_company ON ai_tools(company_id);
CREATE INDEX idx_review_tool ON reviews(tool_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_favorite_user ON favorites(user_id);
CREATE INDEX idx_search_user ON history(user_id);
-- Index pour filtrer rapidement par Administrateur (Recherche : WHERE admin_id = ...)
CREATE INDEX idx_log_admin 
ON admin_logs(admin_id);

-- Index pour filtrer par type d'action (Recherche : WHERE action_type = ...)
CREATE INDEX idx_log_action 
ON admin_logs(action_type);

-- Index composite (Double Index) pour retrouver l'historique d'un élément précis
-- MySQL va d'abord cibler la table (ex: ai_tools) puis l'identifiant (ex: 45)
CREATE INDEX idx_log_target 
ON admin_logs(target_type, target_id);

-- ============================================================================
-- INDEXES DE PERFORMANCE POUR LA TABLE ADMINS
-- ============================================================================
-- Optimise la vitesse de vérification des droits lors des requêtes d'API
CREATE INDEX idx_admin_user ON admins(user_id);
CREATE INDEX idx_admin_level ON admins(admin_level);


-- =========================================================
-- CATEGORIES
-- =========================================================

INSERT INTO categories (name, description, icon) VALUES
('Texte & écriture', 'Assistants texte et LLMs', '📝'),
('Image & design', 'Génération d images', '🎨'),
('Vidéo', 'Création vidéo IA', '🎬'),
('Audio & musique', 'Synthèse vocale et musique', '🎵'),
('Code', 'Assistants de programmation', '💻'),
('Productivité', 'Outils de productivité', '⚡'),
('Recherche', 'Moteurs de recherche IA', '🔍'),
('Chatbots', 'Assistants conversationnels', '💬'),
('Données & analyse', 'Analyse de données', '📊'),
('Avatar & voix', 'Avatars IA', '🧑');



INSERT INTO categories (name, description, icon) VALUES
('Marketing & SEO', 'Génération de contenu marketing, pub et référencement', '📈'),
('Éducation & Recherche', 'Outils d aide à la recherche académique et apprentissage', '🎓'),
('Modélisation 3D', 'Génération d objets et structures 3D', '📦');

-- =========================================================
-- COMPANIES
-- =========================================================

INSERT INTO companies (name, country, website) VALUES
('OpenAI','USA','https://openai.com'),
('Anthropic','USA','https://anthropic.com'),
('Google DeepMind','USA','https://deepmind.google'),
('Mistral AI','France','https://mistral.ai'),
('Perplexity AI','USA','https://perplexity.ai'),
('Midjourney Inc.','USA','https://midjourney.com'),
('Stability AI','UK','https://stability.ai'),
('Canva','Australie','https://canva.com'),
('Runway ML','USA','https://runwayml.com'),
('Kuaishou Technology','Chine','https://klingai.com'), 
('ElevenLabs','USA','https://elevenlabs.io'),
('Suno AI','USA','https://suno.ai'),
('Udio','USA','https://udio.com'),
('GitHub / Microsoft','USA','https://github.com'),
('Anysphere','USA','https://cursor.sh'),
('Replit','USA','https://replit.com'),
('Notion Labs','USA','https://notion.so'),
('Gamma App','USA','https://gamma.app'),
('HeyGen','USA','https://heygen.com'),
('Synthesia','UK','https://synthesia.io'),
('Cohere','Canada','https://cohere.com'),
('Julius AI','USA','https://julius.ai'),
('xAI','USA','https://x.ai'),
('Meta','USA','https://ai.meta.com'),
('Microsoft','USA','https://microsoft.com'),
('You.com','USA','https://you.com'),
('Jasper AI','USA','https://jasper.ai'),
('Copy.ai','USA','https://copy.ai'),
('Adobe','USA','https://adobe.com'),
('Pika Labs','USA','https://pika.art'),
('Murf AI','USA','https://murf.ai'),
('Zapier','USA','https://zapier.com'),
('Genspark','USA','https://genspark.ai'),
('Luma AI','USA','https://lumalabs.ai'),
('Pinecone Systems','USA','https://pinecone.io'),
('Consensus NLP','USA','https://consensus.app'),
('Descript','USA','https://descript.com');

-- =========================================================
-- AI TOOLS
-- =========================================================

-- =========================================================
-- IMPORTATION DU RÉFÉRENTIEL GLOBAL AI (40 OUTILS)
-- =========================================================

-- Bloc 1 : Outils 1 à 10
INSERT INTO ai_tools (categorie_principale_id, company_id, name, slug, description, website_url, pricing_type, global_rating, is_new, api_available, is_available_web, is_available_windows, is_available_mac, is_available_ios, is_available_android, supported_languages, free_plan_details, pro_plan_details, integrations, status) VALUES
(1, 1, 'ChatGPT', 'chatgpt', 'Assistant conversationnel multimodal, le plus utilisé au monde.', 'https://chat.openai.com', 'freemium', 4.9, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, '100+ langues', '40 msg / 3h', 'Illimité (GPT-4o)', 'Zapier, Slack, Make, Notion, Salesforce', 'active'),
(1, 2, 'Claude', 'claude', 'Assistant IA d''Anthropic, nuancé et adapté aux longues analyses.', 'https://claude.ai', 'freemium', 4.8, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, '50+ langues', '~20 msg / jour', 'Illimité (Claude 4)', 'Zapier, Slack, Google Drive, Gmail', 'active'),
(1, 3, 'Gemini', 'gemini', 'IA multimodale de Google intégrée à Workspace.', 'https://gemini.google.com', 'freemium', 4.5, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, '40+ langues', 'Illimité (Gemini 1.5 Flash)', 'Illimité (Gemini 2.0 Pro)', 'Google Workspace, Docs, Sheets, Gmail', 'active'),
(8, 4, 'Mistral Le Chat', 'mistral-le-chat', 'LLM open-source européen très performant via interface chat.', 'https://mistral.ai', 'freemium', 4.5, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Multilingue (focus FR/EN)', 'Illimité (Mistral Small)', 'Illimité (Mistral Large)', 'API REST, Azure, AWS, GCP', 'active'),
(7, 5, 'Perplexity', 'perplexity', 'Moteur de recherche IA qui cite ses sources en temps réel.', 'https://perplexity.ai', 'freemium', 4.6, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, '30+ langues', '5 Pro searches / jour', '300 Pro searches / jour', 'API, Zapier', 'active'),
(2, 6, 'Midjourney', 'midjourney', 'Génération d''images artistiques de haute qualité via prompts.', 'https://midjourney.com', 'paid', 4.9, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal, autres acceptés', '~25 images (trial)', 'Illimité (Fast GPU)', 'Discord', 'active'),
(2, 1, 'DALL·E 3', 'dalle-3', 'Générateur d''images d''OpenAI intégré à ChatGPT Plus.', 'https://openai.com/dall-e-3', 'freemium', 4.6, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Multilingue', '15 images / mois (Bing)', 'Inclus dans ChatGPT Plus', 'ChatGPT, API OpenAI, Azure', 'active'),
(2, 7, 'Stable Diffusion', 'stable-diffusion', 'Modèle open-source de génération d''images, auto-hébergeable.', 'https://stability.ai', 'free', 4.4, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 'EN principal', 'Illimité (local)', 'Illimité (local)', 'ComfyUI, Automatic1111, API', 'active'),
(2, 8, 'Canva AI', 'canva-ai', 'Suite design complète avec outils IA (Magic Studio).', 'https://canva.com', 'freemium', 4.5, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, '100+ langues', '50 crédits IA / mois', '500 crédits IA / mois', 'Slack, Google Drive, Dropbox, HubSpot', 'active'),
(3, 9, 'Runway', 'runway', 'Création et édition vidéo avec IA générative (Gen-3).', 'https://runwayml.com', 'freemium', 4.7, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal', '125 crédits', '2250 crédits / mois', 'Adobe Premiere, API', 'active');

-- Bloc 2 : Outils 11 à 20
INSERT INTO ai_tools (categorie_principale_id, company_id, name, slug, description, website_url, pricing_type, global_rating, is_new, api_available, is_available_web, is_available_windows, is_available_mac, is_available_ios, is_available_android, supported_languages, free_plan_details, pro_plan_details, integrations, status) VALUES
(3, 1, 'Sora', 'sora', 'Génération de vidéos réalistes depuis du texte par OpenAI.', 'https://sora.com', 'paid', 4.8, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal', 'Non disponible', '50 vidéos prioritaires / mois', 'ChatGPT Plus', 'active'),
(3, 10, 'Kling AI', 'kling-ai', 'Génération vidéo haute qualité depuis texte ou image.', 'https://klingai.com', 'freemium', 4.6, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'ZH, EN', '66 crédits / jour', '3000 crédits / mois', 'API (bêta)', 'active'),
(4, 11, 'ElevenLabs', 'elevenlabs', 'Synthèse vocale ultra-réaliste et clonage de voix.', 'https://elevenlabs.io', 'freemium', 4.8, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, '32 langues', '10 000 caractères / mois', '100 000 caractères / mois', 'Zapier, Make, API REST', 'active'),
(4, 12, 'Suno', 'suno', 'Génération de chansons complètes (voix + instruments).', 'https://suno.ai', 'freemium', 4.6, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'Multilingue', '50 crédits / jour', '2500 crédits / mois', 'Discord', 'active'),
(4, 13, 'Udio', 'udio', 'Génération musicale IA avec contrôle du style et paroles.', 'https://udio.com', 'freemium', 4.4, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Multilingue', '100 crédits / mois', '1200 crédits / mois', 'Aucune', 'active'),
(5, 14, 'GitHub Copilot', 'github-copilot', 'Assistant de programmation IA intégré à VS Code & GitHub.', 'https://github.com/features/copilot', 'paid', 4.7, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 'All major programming languages', '2000 complétions / mois (trial)', 'Illimité', 'VS Code, JetBrains, Neovim, GitHub', 'active'),
(5, 15, 'Cursor', 'cursor', 'Éditeur de code avec IA intégrée pour générer et refactorer.', 'https://cursor.sh', 'freemium', 4.8, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, 'Tous les langages', '2000 complétions / mois', 'Illimité', 'GitHub, VS Code extensions', 'active'),
(5, 16, 'Replit AI', 'replit-ai', 'Environnement de développement cloud avec agent IA.', 'https://replit.com', 'freemium', 4.3, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, '50+ langages', '~10 générations / jour', 'Illimité', 'GitHub, Nix', 'active'),
(6, 17, 'Notion AI', 'notion-ai', 'IA intégrée à Notion pour rédiger, résumer, organiser.', 'https://notion.so/product/ai', 'paid', 4.4, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, 'Multilingue', '20 requêtes (trial)', 'Illimité', 'Slack, GitHub, Google Drive, Zapier', 'active'),
(6, 18, 'Gamma', 'gamma', 'Création de présentations et documents IA en secondes.', 'https://gamma.app', 'freemium', 4.5, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Multilingue', '400 crédits IA', 'Illimité', 'Slack, Google Slides export', 'active');

-- Bloc 3 : Outils 21 à 30
INSERT INTO ai_tools (categorie_principale_id, company_id, name, slug, description, website_url, pricing_type, global_rating, is_new, api_available, is_available_web, is_available_windows, is_available_mac, is_available_ios, is_available_android, supported_languages, free_plan_details, pro_plan_details, integrations, status) VALUES
(10, 19, 'HeyGen', 'heygen', 'Vidéos avec avatars IA réalistes et traduction lip-sync.', 'https://heygen.com', 'freemium', 4.5, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, '40+ langues', '1 vidéo / mois', '15 vidéos / mois', 'Zapier, API REST, HubSpot', 'active'),
(10, 20, 'Synthesia', 'synthesia', 'Vidéos de formation avec présentateurs IA réalistes.', 'https://synthesia.io', 'paid', 4.3, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, '120+ langues', 'Démo uniquement', '10-30 vidéos / mois', 'PowerPoint, API REST, LMS', 'active'),
(9, 21, 'Cohere', 'cohere', 'Plateforme NLP pour recherche sémantique et analyse.', 'https://cohere.com', 'freemium', 4.3, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Multilingue', 'Trial API key', 'Selon usage (tokens)', 'AWS, GCP, Azure, LangChain', 'active'),
(9, 22, 'Julius AI', 'julius-ai', 'Analyse de données et visualisation automatique par IA.', 'https://julius.ai', 'freemium', 4.4, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN, FR, ES, DE', '15 requêtes / mois', '250 requêtes / mois', 'Google Sheets, CSV, Excel', 'active'),
(8, 23, 'Grok', 'grok', 'Assistant IA de xAI intégré à X (Twitter), accès temps réel.', 'https://x.ai/grok', 'freemium', 4.4, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, 'Multilingue', '10 requêtes / 2h (X Free)', 'Illimité (X Premium+)', 'X (Twitter), API xAI', 'active'),
(8, 24, 'Meta AI', 'meta-ai', 'Assistant IA de Meta intégré à WhatsApp, Instagram & Messenger.', 'https://ai.meta.com', 'free', 4.3, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'Multilingue', 'Illimité', 'NULL', 'WhatsApp, Instagram, Messenger, Facebook', 'active'),
(6, 25, 'Copilot Microsoft', 'copilot-microsoft', 'Assistant IA intégré à Windows, Office 365 et Edge.', 'https://copilot.microsoft.com', 'freemium', 4.4, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, '100+ langues', 'Illimité (GPT-4o mini)', 'Illimité + priorité (GPT-4o)', 'Word, Excel, PowerPoint, Teams, Outlook', 'active'),
(7, 26, 'You.com', 'youcom', 'Moteur de recherche IA personnalisable avec agents intégrés.', 'https://you.com', 'freemium', 4.2, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'Multilingue', 'Illimité (You Basic)', 'Illimité (You Pro)', 'Chrome extension', 'active'),
(1, 27, 'Jasper AI', 'jasper-ai', 'Plateforme de rédaction marketing IA pour équipes créatives.', 'https://jasper.ai', 'paid', 4.3, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, '30+ langues', '7 jours d''essai', 'Illimité (selon plan)', 'Google Docs, Zapier, Surfer SEO, HubSpot', 'active'),
(1, 28, 'Copy.ai', 'copyai', 'Génération de contenus marketing, emails et publicités.', 'https://copy.ai', 'freemium', 4.2, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, '25+ langues', '2000 mots / mois', 'Illimité', 'Zapier, HubSpot, Salesforce, Slack', 'active');

-- Bloc 4 : Outils 31 à 40
INSERT INTO ai_tools (categorie_principale_id, company_id, name, slug, description, website_url, pricing_type, global_rating, is_new, api_available, is_available_web, is_available_windows, is_available_mac, is_available_ios, is_available_android, supported_languages, free_plan_details, pro_plan_details, integrations, status) VALUES
(2, 29, 'Adobe Firefly', 'adobe-firefly', 'Suite IA créative Adobe pour images, vecteurs et effets.', 'https://firefly.adobe.com', 'freemium', 4.5, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 'Multilingue', '25 crédits / mois', 'Illimité (Creative Cloud)', 'Photoshop, Illustrator, Premiere, Express', 'active'),
(3, 30, 'Pika Labs', 'pika-labs', 'Génération et édition vidéo IA de nouvelle génération.', 'https://pika.art', 'freemium', 4.5, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal', '250 crédits / mois', '700 crédits / mois', 'Discord', 'active'),
(4, 31, 'Murf AI', 'murf-ai', 'Voix off IA professionnelles en 20+ langues pour contenus.', 'https://murf.ai', 'freemium', 4.5, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, '20+ langues', '10 min audio / mois', '4h audio / mois', 'PowerPoint, Canva, Google Slides, API', 'active'),
(6, 32, 'Zapier AI', 'zapier-ai', 'Automatisation de workflows IA entre 6000+ applications.', 'https://zapier.com/ai', 'freemium', 4.4, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal', '100 tâches / mois', 'Selon plan (750+)', '6000+ apps (Slack, Gmail, Salesforce...)', 'active'),
(7, 33, 'Genspark', 'genspark', 'Agent de recherche IA qui crée des Sparkpages synthétiques.', 'https://genspark.ai', 'freemium', 4.5, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, FALSE, 'Multilingue', 'Illimité (basique)', 'Illimité (Genspark+)', 'Aucune', 'active'),
(5, 2, 'Claude Code', 'claude-code', 'Agent de codage en ligne de commande par Anthropic.', 'https://claude.ai/code', 'paid', 4.7, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Tous les langages', 'NULL', 'Selon tokens (API)', 'Terminal, GitHub, VS Code', 'active'),
(2, 34, 'Luma AI', 'luma-ai', 'Génération 3D et vidéo IA (Dream Machine) depuis images.', 'https://lumalabs.ai', 'freemium', 4.6, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, 'EN principal', '30 générations / mois', '120-400 générations / mois', 'API REST', 'active'),
(9, 35, 'Pinecone', 'pinecone', 'Base de données vectorielle pour apps IA et RAG.', 'https://pinecone.io', 'freemium', 4.4, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 'Tous (API)', '1 index, 100k vecteurs', 'Selon usage', 'LangChain, LlamaIndex, OpenAI, AWS', 'active'),
(7, 36, 'Consensus', 'consensus', 'Moteur de recherche IA spécialisé dans la littérature scientifique.', 'https://consensus.app', 'freemium', 4.5, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 'EN principal', '20 recherches / mois', 'Illimité', 'Chrome extension, Zotero', 'active'),
(4, 37, 'Descript', 'descript', 'Édition audio/vidéo IA par transcription textuelle.', 'https://descript.com', 'freemium', 4.6, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, '23 langues', '1h transcription / mois', '10h transcription / mois', 'Zapier, Slack, YouTube, Wistia', 'active');

-- =========================================================
-- Password: Admin1234!
-- =========================================================
INSERT INTO users (
    name,
    email,
    password_hash,
    role,
    status,
    is_active
) VALUES (
    'Admin Hub',
    'admin@aitoolshub.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin',
    'active',
    TRUE
);


-- 2. Élévation des privilèges et configuration des droits dans 'admins'
-- On récupère l'id 1 généré par l'insertion précédente (Super Admin = Tout à TRUE)
INSERT INTO admins (
    user_id, 
    admin_level, 
    can_validate_ai, 
    can_edit_ai, 
    can_delete_review, 
    can_manage_users, 
    can_manage_admins
) VALUES (
    1, 
    'super_admin', 
    TRUE, 
    TRUE, 
    TRUE, 
    TRUE, 
    TRUE
);

-- =========================================================
-- TAGS
-- =========================================================

INSERT INTO tags (name) VALUES
('LLM'),
('Chatbot'),
('Generative AI'),
('Image Generation'),
('Video Generation'),
('Voice Cloning'),
('Programming'),
('Productivity'),
('Search Engine'),
('Data Analysis'),
('Automation'),
('API'),
('Open Source'),
('AI Assistant'),
('Translation'),
('Text To Speech'),
('Speech To Text'),
('Machine Learning'),
('Writing'),
('Code Completion');

-- =========================================================
-- TOOL TAGS
-- =========================================================

INSERT INTO tool_tags (tool_id, tag_id) VALUES
-- 1. ChatGPT (ID 1) : LLM, Chatbot, Generative AI, AI Assistant, Writing
(1,1), (1,2), (1,3), (1,14), (1,19),

-- 2. Claude (ID 2) : LLM, AI Assistant, Writing, Programming
(2,1), (2,14), (2,19), (2,7),

-- 3. Gemini (ID 3) : LLM, AI Assistant, Translation, Generative AI
(3,1), (3,14), (3,15), (3,3),

-- 4. Mistral Le Chat (ID 4) : LLM, Chatbot, Open Source
(4,1), (4,2), (4,13),

-- 5. Perplexity (ID 5) : Search Engine, AI Assistant
(5,9), (5,14),

-- 6. Midjourney (ID 6) : Image Generation, Generative AI
(6,4), (6,3),

-- 7. DALL·E 3 (ID 7) : Image Generation, Generative AI
(7,4), (7,3),

-- 8. Stable Diffusion (ID 8) : Image Generation, Open Source, Generative AI
(8,4), (8,13), (8,3),

-- 9. Canva AI (ID 9) : Productivity, Image Generation
(9,8), (9,4),

-- 10. Runway (ID 10) : Video Generation, Generative AI
(10,5), (10,3),

-- 11. Sora (ID 11) : Video Generation, Generative AI
(11,5), (11,3),

-- 12. Kling AI (ID 12) : Video Generation, Generative AI
(12,5), (12,3),

-- 13. ElevenLabs (ID 13) : Voice Cloning, Text To Speech
(13,6), (13,16),

-- 14. Suno (ID 14) : Generative AI (Musique)
(14,3),

-- 15. Udio (ID 15) : Generative AI (Musique)
(15,3),

-- 16. GitHub Copilot (ID 16) : Programming, Code Completion, API
(16,7), (16,20), (16,12),

-- 17. Cursor (ID 17) : Programming, Code Completion
(17,7), (17,20),

-- 18. Replit AI (ID 18) : Programming, Automation
(18,7), (18,11),

-- 19. Notion AI (ID 19) : Productivity, Writing
(19,8), (19,19),

-- 20. Gamma (ID 20) : Productivity, Generative AI
(20,8), (20,3),

-- 21. HeyGen (ID 21) : Video Generation, Translation, Voice Cloning
(21,5), (21,15), (21,6),

-- 22. Synthesia (ID 22) : Video Generation, AI Assistant
(22,5), (22,14),

-- 23. Cohere (ID 23) : LLM, Machine Learning, API
(23,1), (23,18), (23,12),

-- 24. Julius AI (ID 24) : Data Analysis, Machine Learning
(24,10), (24,18),

-- 25. Grok (ID 25) : LLM, Chatbot, AI Assistant
(25,1), (25,2), (25,14),

-- 26. Meta AI (ID 26) : Chatbot, AI Assistant
(26,2), (26,14),

-- 27. Copilot Microsoft (ID 27) : Productivity, AI Assistant
(27,8), (27,14),

-- 28. You.com (ID 28) : Search Engine, Chatbot
(28,9), (28,2),

-- 29. Jasper AI (ID 29) : Writing, Productivity
(29,19), (29,8),

-- 30. Copy.ai (ID 30) : Writing, Automation
(30,19), (30,11),

-- 31. Adobe Firefly (ID 31) : Image Generation, Generative AI
(31,4), (31,3),

-- 32. Pika Labs (ID 32) : Video Generation
(32,5),

-- 33. Murf AI (ID 33) : Text To Speech, Voice Cloning
(33,16), (33,6),

-- 34. Zapier AI (ID 34) : Automation, Productivity
(34,11), (34,8),

-- 35. Genspark (ID 35) : Search Engine, AI Assistant
(35,9), (35,14),

-- 36. Claude Code (ID 36) : Programming, Automation
(36,7), (36,11),

-- 37. Luma AI (ID 37) : Image Generation, Generative AI (3D)
(37,4), (37,3),

-- 38. Pinecone (ID 38) : Data Analysis, API
(38,10), (38,12),

-- 39. Consensus (ID 39) : Search Engine, Data Analysis
(39,9), (39,10),

-- 40. Descript (ID 40) : Speech To Text, Text To Speech, Productivity
(40,17), (40,16), (40,8);

-- =========================================================
-- TOOL IMAGES
-- =========================================================

-- INSERT INTO tool_images (
--     tool_id,
--     image_url,
--     is_primary
-- ) VALUES

-- (1,'https://images.unsplash.com/photo-1677442136019-21780ecad995',TRUE),
-- (2,'https://images.unsplash.com/photo-1675557009875-436fcb5f5f3c',TRUE),
-- (3,'https://images.unsplash.com/photo-1686191128892-3f6b2d7d7c8d',TRUE),
-- (4,'https://images.unsplash.com/photo-1451187580459-43490279c0fa',TRUE),
-- (5,'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',TRUE),
-- (6,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',TRUE),
-- (7,'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb',TRUE),
-- (8,'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',TRUE),
-- (9,'https://images.unsplash.com/photo-1516321497487-e288fb19713f',TRUE),
-- (10,'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',TRUE),
-- (11,'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',TRUE),
-- (12,'https://images.unsplash.com/photo-1484417894907-623942c8ee29',TRUE),
-- (13,'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',TRUE),
-- (14,'https://images.unsplash.com/photo-1551288049-bebda4e38f71',TRUE),
-- (15,'https://images.unsplash.com/photo-1516321165247-4aa89a48be28',TRUE);

-- =========================================================
-- USERS
-- =========================================================

-- =========================================================
-- USERS : ÉQUIPE DE DÉVELOPPEMENT (Membres Actifs)
-- Mot de passe par défaut pour les tests : Admin1234!
-- =========================================================

INSERT INTO users (
    name,
    email,
    password_hash,
    profile_url,
    role,
    status,
    is_active
) VALUES
(
    'Naima Agouzoul',
    'naima@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'https://i.pravatar.cc/150?img=1',
    'user',
    'active',
    TRUE
),
(
    'Hiba Elmahdaoui',
    'hiba@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'https://i.pravatar.cc/150?img=2',
    'user',
    'active',
    TRUE
),
(
    'Doha Elmachraa',
    'doha@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'https://i.pravatar.cc/150?img=3',
    'user',
    'active',
    TRUE
),
(
    'Nassima Moujib',
    'nassima@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'https://i.pravatar.cc/150?img=4',
    'user',
    'active',
    TRUE
);

-- =========================================================
-- REVIEWS
-- =========================================================

INSERT INTO reviews (
    user_id,
    tool_id,
    rating,       -- La note (peut être NULL si c'était juste un simple commentaire)
    comment   -- Le texte/contenu (l'avis ou le commentaire)
) VALUES
-- 1. ChatGPT (ID 1)
(5, 1, 5, 'Excellent assistant IA pour tout type de travail.'),
(3, 1, 5, 'Très utile pour apprendre et coder.'),
(2, 1, 4, 'Je recommande fortement ChatGPT pour les étudiants.'), -- Ancien commentaire de Naima

-- 2. Claude (ID 2)
(4, 2, 4, 'Claude est excellent pour les longues analyses.'),
(5, 2, 5, 'Claude comprend très bien les longs documents.'), -- Ancien commentaire de Nassima

-- 3. Perplexity (ID 5)
(2, 5, 4, 'Perplexity est parfait pour la recherche.'),
(3, 5, 4, 'Perplexity est meilleur que Google pour certaines recherches.'), -- Ancien commentaire

-- 4. Midjourney (ID 6)
(5, 6, 5, 'Midjourney crée des images incroyables.'),
(3, 6, 4, 'Midjourney produit des rendus magnifiques.'), -- Ancien commentaire de Hiba

-- 5. Runway (ID 10)
(4, 10, 4, 'Runway facilite le montage vidéo IA.'),
(3, 10, 5, 'Runway Gen-3 est très puissant pour la vidéo.'), -- Ancien commentaire de Hiba

-- 6. ElevenLabs (ID 13)
(5, 13, 5, 'Voix ultra réalistes avec ElevenLabs.'),
(3, 13, 3, 'Le clonage vocal est impressionnant.'),

-- 7. GitHub Copilot (ID 16)
(2, 16, 5, 'Copilot accélère énormément le développement.'),
(4, 16, 4, 'GitHub Copilot me fait gagner beaucoup de temps.'), -- Ancien commentaire de Doha

-- 8. Cursor (ID 17)
(3, 17, 5, 'Cursor est devenu mon IDE préféré.'),
(4, 17, 4, 'Cursor facilite la refactorisation de code.'), -- Ancien commentaire de Doha

-- 9. Notion AI (ID 19)
(3, 19, 4, 'Notion AI aide beaucoup en productivité.');

-- ============================================================================
-- 15. TABLE : FAVORITES (Version Finale)
-- ============================================================================
INSERT INTO favorites (
    user_id,
    tool_id
) VALUES
(2, 1),   -- Naima aime ChatGPT (ID 1)
(2, 16),  -- Naima aime GitHub Copilot (ID 16)
(3, 6),   -- Hiba aime Midjourney (ID 6)
(3, 17),  -- Hiba aime Cursor (ID 17)
(4, 2),   -- Doha aime Claude (ID 2)
(4, 10),  -- Doha aime Runway (ID 10)
(5, 13),  -- Nassima aime ElevenLabs (ID 13)
(5, 1);   -- Nassima aime ChatGPT (ID 1)


-- ============================================================================
-- 16. TABLE : HISTORY (Adaptée à vos colonnes : 'categorie_id')
-- Assigne des IDs de catégories valides de votre table 'categories'
-- ============================================================================
INSERT INTO history (
    user_id,
    query_text,
    categorie_id
) VALUES
(2, 'best ai chatbot', 1),        -- Naima cherche dans la catégorie Texte/LLM (ex: ID 1)
(2, 'image generation tools', 2), -- Naima cherche dans la catégorie Image (ex: ID 2)
(3, 'code assistant ai', 5),      -- Hiba cherche dans la catégorie Code (ex: ID 4)
(3, 'video ai tools', 3),         -- Hiba cherche dans la catégorie Vidéo (ex: ID 3)
(4, 'text generation ai', 1),     -- Doha cherche dans la catégorie Texte/LLM
(4, 'ai for productivity', NULL), -- Recherche globale (Pas de catégorie spécifique -> NULL)
(5, 'voice cloning ai', NULL),    -- Recherche globale -> NULL
(5, 'best llm 2026', 1);          -- Nassima cherche dans la catégorie Texte/LLM


-- ============================================================================
-- 17. TABLE : REPORTS (Adaptée à vos colonnes : 'comment_id' lié à 'reviews')
-- ============================================================================
INSERT INTO reports (
    user_id,
    tool_id,
    comment_id, -- Clé étrangère pointant bien sur l'id de votre table reviews unique
    reason,
    status
) VALUES
-- Naima (ID 2) signale l'avis/commentaire n°3 pour Spam
(2, NULL, 3, 'Spam content', 'reviewed'),      

-- Hiba (ID 3) signale l'avis/commentaire n°5 pour Information Incorrecte
(3, NULL, 5, 'Incorrect information', 'pending'), 

-- Doha (ID 4) signale l'avis/commentaire n°2 pour Hors-sujet
(4, NULL, 2, 'Off-topic comment', 'rejected');

ALTER TABLE reviews ADD COLUMN moderation_status ENUM('active', 'pending', 'inactive') DEFAULT 'active';


ALTER TABLE reports 
ADD COLUMN admin_response TEXT DEFAULT NULL,
ADD COLUMN responded_at TIMESTAMP NULL DEFAULT NULL;



-- =========================================================
-- SPEC 1 : Raison de refus dans submissions
-- =========================================================
ALTER TABLE submissions
ADD COLUMN rejection_reason ENUM(
    'Informations incorrectes',
    'Outil déjà existant',
    'Lien invalide',
    'Catégorie incorrecte',
    'Contenu inapproprié'
) DEFAULT NULL,
ADD COLUMN rejection_comment TEXT DEFAULT NULL,
ADD COLUMN admin_id INT DEFAULT NULL,
ADD FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL;

-- =========================================================
-- SPEC 2 : Compteur de refus + suspension utilisateur
-- =========================================================
ALTER TABLE users
ADD COLUMN nb_refus INT DEFAULT 0,
ADD COLUMN date_suspension TIMESTAMP NULL DEFAULT NULL;

-- La colonne status ENUM('active','suspended','pending') existe déjà ✓

-- =========================================================
-- SPEC 3 : Table notifications
-- =========================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('soumission', 'signalement') NOT NULL,
    ref_id INT NOT NULL,
    statut ENUM('accepté', 'refusé', 'en_attente', 'traité') DEFAULT 'en_attente',
    message_admin TEXT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users ADD COLUMN nb_refus INT DEFAULT 0;
