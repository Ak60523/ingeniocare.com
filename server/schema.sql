-- Run this in the Aurora MySQL query editor if you prefer not to rely on auto-create.
CREATE DATABASE IF NOT EXISTS ingeniocare;
USE ingeniocare;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email (email)
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  newsletter TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY newsletter_email (email)
);

CREATE TABLE IF NOT EXISTS news_articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(255) NOT NULL,
  date_label VARCHAR(120) NOT NULL,
  title VARCHAR(500) NOT NULL,
  headline VARCHAR(255) DEFAULT NULL,
  summary TEXT,
  body MEDIUMTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY news_slug (slug)
);

CREATE TABLE IF NOT EXISTS news_aliases (
  slug VARCHAR(255) NOT NULL,
  article_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (slug),
  KEY news_aliases_article (article_id),
  CONSTRAINT news_aliases_article_fk
    FOREIGN KEY (article_id) REFERENCES news_articles(id)
    ON DELETE CASCADE
);
