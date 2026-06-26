-- ============================================================
-- SSE (Society of Software Engineers) - Database Schema
-- MySQL 8.0+ | Run this once to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS sse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sse_db;

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('SUPER_ADMIN','ADMIN','EDITOR','MEMBER') NOT NULL DEFAULT 'MEMBER',
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(30),
  avatar_url      VARCHAR(500),
  membership_number   VARCHAR(50) UNIQUE,
  membership_type     ENUM('STUDENT','ASSOCIATE','FULL','FELLOW') DEFAULT 'ASSOCIATE',
  membership_status   ENUM('PENDING','ACTIVE','SUSPENDED','EXPIRED') DEFAULT 'PENDING',
  bio             TEXT,
  linkedin_url    VARCHAR(500),
  github_url      VARCHAR(500),
  twitter_url     VARCHAR(500),
  state           VARCHAR(100),
  country         VARCHAR(100) DEFAULT 'Nigeria',
  specialty       VARCHAR(200),
  email_verified_at DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_membership_status (membership_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token       VARCHAR(512) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- EXECUTIVES / LEADERSHIP
-- ============================================================

CREATE TABLE IF NOT EXISTS executives (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  position      VARCHAR(200),
  category      ENUM('PRESIDENT','BOD','NEC','SEC','BOA','PATRON') NOT NULL,
  avatar_url    VARCHAR(500),
  bio           TEXT,
  email         VARCHAR(255),
  linkedin_url  VARCHAR(500),
  display_order INT UNSIGNED DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- ============================================================
-- NEWS / BLOG POSTS
-- ============================================================

CREATE TABLE IF NOT EXISTS posts (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(500) NOT NULL,
  slug              VARCHAR(500) NOT NULL UNIQUE,
  excerpt           TEXT,
  content           LONGTEXT,
  featured_image_url VARCHAR(500),
  author_id         INT UNSIGNED,
  status            ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  category          VARCHAR(100),
  tags              JSON,
  view_count        INT UNSIGNED DEFAULT 0,
  published_at      DATETIME,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title                 VARCHAR(500) NOT NULL,
  slug                  VARCHAR(500) NOT NULL UNIQUE,
  description           TEXT,
  content               LONGTEXT,
  featured_image_url    VARCHAR(500),
  organizer_id          INT UNSIGNED,
  event_type            ENUM('CONFERENCE','WEBINAR','WORKSHOP','MEETUP','HACKATHON','SUMMIT') NOT NULL DEFAULT 'WEBINAR',
  status                ENUM('UPCOMING','ONGOING','PAST','CANCELLED') NOT NULL DEFAULT 'UPCOMING',
  location              VARCHAR(300),
  venue_address         TEXT,
  is_virtual            TINYINT(1) DEFAULT 0,
  meeting_link          VARCHAR(500),
  registration_url      VARCHAR(500),
  is_free               TINYINT(1) DEFAULT 1,
  ticket_price          DECIMAL(10,2),
  start_date            DATETIME NOT NULL,
  end_date              DATETIME,
  registration_deadline DATETIME,
  max_attendees         INT UNSIGNED,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_start_date (start_date),
  INDEX idx_event_type (event_type)
) ENGINE=InnoDB;

-- ============================================================
-- PROGRAMS / TRAINING
-- ============================================================

CREATE TABLE IF NOT EXISTS programs (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(500) NOT NULL,
  slug              VARCHAR(500) NOT NULL UNIQUE,
  description       TEXT,
  content           LONGTEXT,
  featured_image_url VARCHAR(500),
  program_type      ENUM('TRAINING','CERTIFICATION','MENTORSHIP','BOOTCAMP','WORKSHOP') NOT NULL DEFAULT 'TRAINING',
  duration          VARCHAR(100),
  format            ENUM('ONLINE','PHYSICAL','HYBRID') DEFAULT 'ONLINE',
  status            ENUM('ACTIVE','INACTIVE','COMING_SOON') NOT NULL DEFAULT 'ACTIVE',
  is_free           TINYINT(1) DEFAULT 1,
  price             DECIMAL(10,2),
  registration_url  VARCHAR(500),
  display_order     INT UNSIGNED DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_program_type (program_type),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- ============================================================
-- PARTNER ORGANIZATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS partners (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(200) NOT NULL,
  logo_url          LONGTEXT,
  website_url       VARCHAR(500),
  description       TEXT,
  status            ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  display_order     INT UNSIGNED DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(30),
  subject     VARCHAR(300),
  message     TEXT NOT NULL,
  status      ENUM('UNREAD','READ','RESPONDED') NOT NULL DEFAULT 'UNREAD',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email             VARCHAR(255) NOT NULL UNIQUE,
  name              VARCHAR(200),
  status            ENUM('SUBSCRIBED','UNSUBSCRIBED') NOT NULL DEFAULT 'SUBSCRIBED',
  subscribed_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at   DATETIME,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- SITE CONTENT CMS (Admin-Editable Page Copy)
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_key   VARCHAR(100) NOT NULL UNIQUE,
  label         VARCHAR(200) NOT NULL,
  content_type  ENUM('TEXT','RICHTEXT','IMAGE_URL','JSON','NUMBER') NOT NULL DEFAULT 'TEXT',
  content_value LONGTEXT,
  updated_by    INT UNSIGNED,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_section_key (section_key)
) ENGINE=InnoDB;

-- ============================================================
-- SEED: Default admin user
-- Login: admin@sseng.org / Admin@12345
-- ============================================================

INSERT INTO users (
  email,
  password_hash,
  role,
  first_name,
  last_name,
  membership_number,
  membership_type,
  membership_status,
  country,
  specialty,
  email_verified_at
) VALUES (
  'admin@sseng.org',
  '$2b$12$T8JtLCpeWEeJY5QCBm.5zOTrx6kLoYG69c.bKLnM/NT5kJjd9C.Au',
  'SUPER_ADMIN',
  'SSE',
  'Admin',
  'SSE/ADMIN/0001',
  'FULL',
  'ACTIVE',
  'Nigeria',
  'Administration',
  CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = 'SUPER_ADMIN',
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  membership_type = VALUES(membership_type),
  membership_status = 'ACTIVE',
  country = VALUES(country),
  specialty = VALUES(specialty),
  email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP);

-- ============================================================
-- SEED: Default site_content values (all placeholder)
-- ============================================================

INSERT INTO site_content (section_key, label, content_type, content_value) VALUES
-- Hero Section
('hero_headline',       'Hero: Main Headline',          'TEXT',     'Building Nigeria\'s Digital Future'),
('hero_subheadline',    'Hero: Sub Headline',           'TEXT',     'Society of Software Engineers'),
('hero_subtext',        'Hero: Supporting Text',        'TEXT',     'The premier professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.'),
('hero_cta_primary',    'Hero: Primary Button Label',   'TEXT',     'Become a Member'),
('hero_cta_secondary',  'Hero: Secondary Button Label', 'TEXT',     'Learn More'),
('hero_image_1',        'Hero: Slide Image 1 URL',      'IMAGE_URL','/images/hero_slide_1.png'),
('hero_image_2',        'Hero: Slide Image 2 URL',      'IMAGE_URL','/images/hero_slide_2.png'),
('hero_image_3',        'Hero: Slide Image 3 URL',      'IMAGE_URL','/images/hero_slide_3.png'),

-- Vision / Mission / Programs Strip
('strip_vision_title',  'Strip: Vision Label',          'TEXT',     '01. VISION'),
('strip_vision_body',   'Strip: Vision Text',           'RICHTEXT', 'To build a vibrant and globally respected community of software engineering professionals that inspires technological innovation, nurtures exceptional talent, and positions Nigeria as a leading hub for software development and digital solutions.'),
('strip_mission_title', 'Strip: Mission Label',         'TEXT',     '02. MISSION'),
('strip_mission_body',  'Strip: Mission Text',          'RICHTEXT', 'To advance the software engineering profession through professional development, technical capacity building, research, mentorship, strategic partnerships, advocacy, and the promotion of quality software practices.'),
('strip_programs_title','Strip: Programs Label',        'TEXT',     '03. PROGRAMS'),
('strip_programs_body', 'Strip: Programs Text',         'RICHTEXT', 'Through personalized trainings, expert-led workshops, certification pathways, and mentorship programs, SSE equips software engineers with the skills needed to thrive in a rapidly evolving digital landscape.'),

-- Stats
('stat_members_value',  'Stats: Members Count',         'NUMBER',   '500+'),
('stat_members_label',  'Stats: Members Label',         'TEXT',     'Members'),
('stat_programs_value', 'Stats: Programs Count',        'NUMBER',   '10+'),
('stat_programs_label', 'Stats: Programs Label',        'TEXT',     'Programs'),
('stat_events_value',   'Stats: Events Count',          'NUMBER',   '25+'),
('stat_events_label',   'Stats: Events Label',          'TEXT',     'Events'),
('stat_states_value',   'Stats: States Count',          'NUMBER',   '36'),
('stat_states_label',   'Stats: States Label',          'TEXT',     'States'),

-- CTA Section
('cta_headline',        'CTA: Headline',                'TEXT',     'Ready to Join Nigeria\'s Premier Software Engineering Community?'),
('cta_subtext',         'CTA: Supporting Text',        'TEXT',     'Become part of a network of thousands of software professionals driving Nigeria\'s digital transformation.'),
('cta_primary_label',   'CTA: Primary Button Label',   'TEXT',     'Register Now'),
('cta_secondary_label', 'CTA: Secondary Button Label', 'TEXT',     'Contact Us'),

-- About Page
('about_intro',         'About: Intro Paragraph',      'RICHTEXT', 'The Society of Software Engineers (SSE) is the foremost professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.'),
('about_activities_intro', 'About: Core Activities Intro', 'TEXT', 'We offer a range of activities designed to enhance the skills and knowledge of our members, including:'),

-- Footer
('footer_tagline',      'Footer: Tagline',              'TEXT',     'Advancing Software Engineering. Empowering Nigeria\'s Digital Future.'),
('footer_address',      'Footer: Address',              'TEXT',     'Abuja Nigeria'),
('footer_email',        'Footer: Contact Email',        'TEXT',     'info@sse.ng'),
('footer_phone',        'Footer: Contact Phone',        'TEXT',     '07003100071'),

-- Social Media
('social_facebook',     'Social: Facebook URL',         'TEXT',     '#'),
('social_twitter',      'Social: Twitter/X URL',        'TEXT',     '#'),
('social_linkedin',     'Social: LinkedIn URL',         'TEXT',     '#'),
('social_github',       'Social: GitHub URL',           'TEXT',     '#'),
('social_telegram',     'Social: Telegram URL',         'TEXT',     '#'),
('social_whatsapp',     'Social: WhatsApp Number',      'TEXT',     '');
