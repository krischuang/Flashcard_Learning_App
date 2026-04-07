-- ── Flashcard App — Database Schema ─────────────────────────────────────────
-- Creates the flashcards table used by the FastAPI backend.
-- This file is automatically executed by Docker when the MySQL container
-- starts for the first time (mounted into /docker-entrypoint-initdb.d/).
-- It can also be run manually:
--   mysql -u flashcard_user -p flashcard_db < database/schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS flashcard_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flashcard_db;

CREATE TABLE IF NOT EXISTS flashcards (
  id         INT          NOT NULL AUTO_INCREMENT,
  question   TEXT         NOT NULL,
  answer     TEXT         NOT NULL,
  category   VARCHAR(100) NOT NULL DEFAULT 'General',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
