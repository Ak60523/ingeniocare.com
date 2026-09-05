import mysql from "mysql2/promise";

export function createPool() {
  const host = process.env.AURORA_HOST;
  if (!host) return null;

  return mysql.createPool({
    host,
    port: Number(process.env.AURORA_PORT || 3306),
    user: process.env.AURORA_USER,
    password: process.env.AURORA_PASSWORD,
    database: process.env.AURORA_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: process.env.AURORA_SSL === "false" ? undefined : { rejectUnauthorized: true },
  });
}

export async function initSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY users_email (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT,
      newsletter TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY newsletter_email (email)
    )
  `);

  await pool.query(`
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
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS news_aliases (
      slug VARCHAR(255) NOT NULL,
      article_id BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (slug),
      KEY news_aliases_article (article_id),
      CONSTRAINT news_aliases_article_fk
        FOREIGN KEY (article_id) REFERENCES news_articles(id)
        ON DELETE CASCADE
    )
  `);
}
