// =============================================================================
// BUILTIT AI — SQLite Database (better-sqlite3, server-only)
// =============================================================================
// This file MUST only be imported in server code (API routes, Server Actions).
// Never import in 'use client' components.

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// DB path
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'builtit.db');

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  initSchema(_db);
  seedDemoUser(_db);
  return _db;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT PRIMARY KEY,
      email        TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name         TEXT NOT NULL,
      avatar_url   TEXT,
      provider     TEXT NOT NULL DEFAULT 'email',
      password_hash TEXT,
      salt         TEXT,
      settings     TEXT NOT NULL DEFAULT '{}',
      subscription TEXT NOT NULL DEFAULT '{}',
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id               TEXT PRIMARY KEY,
      user_id          TEXT NOT NULL,
      name             TEXT NOT NULL,
      description      TEXT,
      status           TEXT NOT NULL DEFAULT 'active',
      diagram_type     TEXT,
      thumbnail_url    TEXT,
      tags             TEXT NOT NULL DEFAULT '[]',
      created_at       TEXT NOT NULL,
      updated_at       TEXT NOT NULL,
      last_accessed_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id               TEXT PRIMARY KEY,
      project_id       TEXT NOT NULL,
      user_id          TEXT NOT NULL,
      status           TEXT NOT NULL DEFAULT 'idle',
      diagram_type     TEXT,
      confidence_score REAL NOT NULL DEFAULT 0,
      result           TEXT NOT NULL DEFAULT '{}',
      created_at       TEXT NOT NULL,
      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      project_id TEXT,
      title      TEXT NOT NULL DEFAULT 'New Chat',
      is_pinned  INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id              TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role            TEXT NOT NULL,
      content         TEXT NOT NULL,
      created_at      TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS practice_sessions (
      id            TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL,
      project_id    TEXT NOT NULL,
      mode          TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'active',
      current_step  INTEGER NOT NULL DEFAULT 0,
      total_steps   INTEGER NOT NULL DEFAULT 0,
      score         REAL,
      accuracy      REAL,
      started_at    TEXT NOT NULL,
      completed_at  TEXT,
      time_spent_ms INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_projects_user     ON projects(user_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_convs_user        ON conversations(user_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_conv     ON messages(conversation_id, created_at ASC);
    CREATE INDEX IF NOT EXISTS idx_practice_user     ON practice_sessions(user_id, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_analyses_project  ON analyses(project_id, created_at DESC);
  `);
}

// ---------------------------------------------------------------------------
// Password utilities
// ---------------------------------------------------------------------------

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const attempt = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'));
}

// ---------------------------------------------------------------------------
// Seed demo user
// ---------------------------------------------------------------------------

function seedDemoUser(db: Database.Database) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@builtitai.com');
  if (existing) return;

  const { hash, salt } = hashPassword('demo1234');
  const now = new Date().toISOString();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO users (id, email, name, provider, password_hash, salt, settings, subscription, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'demo@builtitai.com',
    'Demo User',
    'email',
    hash,
    salt,
    JSON.stringify({ theme: 'system', language: 'en', voiceEnabled: false, voiceLanguage: 'en-US', autoSave: true, defaultExportFormat: 'png', notificationsEnabled: true }),
    JSON.stringify({ plan: 'free', status: 'active', uploadsUsed: 0, uploadsLimit: 10 }),
    now,
    now,
  );
}

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  provider: string;
  password_hash: string | null;
  salt: string | null;
  settings: string;
  subscription: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  diagram_type: string | null;
  thumbnail_url: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  is_pinned: number;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message?: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface PracticeRow {
  id: string;
  user_id: string;
  project_id: string;
  mode: string;
  status: string;
  current_step: number;
  total_steps: number;
  score: number | null;
  accuracy: number | null;
  started_at: string;
  completed_at: string | null;
  time_spent_ms: number;
}

export interface AnalysisRow {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  diagram_type: string | null;
  confidence_score: number;
  result: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// User queries
// ---------------------------------------------------------------------------

export const userQueries = {
  findByEmail(email: string): UserRow | undefined {
    return getDb().prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email) as UserRow | undefined;
  },
  findById(id: string): UserRow | undefined {
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  },
  create(data: { name: string; email: string; password: string }): UserRow {
    const { hash, salt } = hashPassword(data.password);
    const now = new Date().toISOString();
    const id = uuidv4();
    getDb().prepare(`
      INSERT INTO users (id, email, name, provider, password_hash, salt, settings, subscription, created_at, updated_at)
      VALUES (?, ?, ?, 'email', ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.email, data.name, hash, salt,
      JSON.stringify({ theme: 'system', language: 'en', voiceEnabled: false, voiceLanguage: 'en-US', autoSave: true, defaultExportFormat: 'png', notificationsEnabled: true }),
      JSON.stringify({ plan: 'free', status: 'active', uploadsUsed: 0, uploadsLimit: 10 }),
      now, now,
    );
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow;
  },
  update(id: string, data: { name?: string; avatar_url?: string; settings?: string; subscription?: string }): void {
    const sets: string[] = ['updated_at = ?'];
    const vals: unknown[] = [new Date().toISOString()];
    if (data.name !== undefined)         { sets.push('name = ?');         vals.push(data.name); }
    if (data.avatar_url !== undefined)   { sets.push('avatar_url = ?');   vals.push(data.avatar_url); }
    if (data.settings !== undefined)     { sets.push('settings = ?');     vals.push(data.settings); }
    if (data.subscription !== undefined) { sets.push('subscription = ?'); vals.push(data.subscription); }
    vals.push(id);
    getDb().prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  },
  delete(id: string): void {
    getDb().prepare('DELETE FROM users WHERE id = ?').run(id);
  },
};

// ---------------------------------------------------------------------------
// Project queries
// ---------------------------------------------------------------------------

export const projectQueries = {
  list(userId: string, search?: string): ProjectRow[] {
    if (search) {
      return getDb().prepare(`
        SELECT * FROM projects WHERE user_id = ? AND status != 'deleted'
        AND (name LIKE ? OR description LIKE ?)
        ORDER BY updated_at DESC LIMIT 50
      `).all(userId, `%${search}%`, `%${search}%`) as ProjectRow[];
    }
    return getDb().prepare(`
      SELECT * FROM projects WHERE user_id = ? AND status != 'deleted'
      ORDER BY updated_at DESC LIMIT 50
    `).all(userId) as ProjectRow[];
  },
  findById(id: string, userId: string): ProjectRow | undefined {
    return getDb().prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(id, userId) as ProjectRow | undefined;
  },
  create(userId: string, name: string, description?: string): ProjectRow {
    const id = uuidv4();
    const now = new Date().toISOString();
    getDb().prepare(`
      INSERT INTO projects (id, user_id, name, description, status, tags, created_at, updated_at, last_accessed_at)
      VALUES (?, ?, ?, ?, 'active', '[]', ?, ?, ?)
    `).run(id, userId, name, description ?? null, now, now, now);
    return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow;
  },
  update(id: string, userId: string, data: Partial<Pick<ProjectRow, 'name' | 'description' | 'status' | 'diagram_type'>>): void {
    const sets: string[] = ['updated_at = ?'];
    const vals: unknown[] = [new Date().toISOString()];
    if (data.name !== undefined)         { sets.push('name = ?');         vals.push(data.name); }
    if (data.description !== undefined)  { sets.push('description = ?');  vals.push(data.description); }
    if (data.status !== undefined)       { sets.push('status = ?');       vals.push(data.status); }
    if (data.diagram_type !== undefined) { sets.push('diagram_type = ?'); vals.push(data.diagram_type); }
    vals.push(id, userId);
    getDb().prepare(`UPDATE projects SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...vals);
  },
  delete(id: string, userId: string): void {
    getDb().prepare(`UPDATE projects SET status = 'deleted', updated_at = ? WHERE id = ? AND user_id = ?`)
      .run(new Date().toISOString(), id, userId);
  },
  countByUser(userId: string): number {
    const row = getDb().prepare(`SELECT COUNT(*) as c FROM projects WHERE user_id = ? AND status != 'deleted'`).get(userId) as { c: number };
    return row.c;
  },
};

// ---------------------------------------------------------------------------
// Conversation queries
// ---------------------------------------------------------------------------

export const conversationQueries = {
  list(userId: string, search?: string): ConversationRow[] {
    if (search) {
      return getDb().prepare(`
        SELECT c.*,
          (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
          (SELECT m2.content FROM messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.created_at DESC LIMIT 1) as last_message
        FROM conversations c
        WHERE c.user_id = ? AND (c.title LIKE ? OR EXISTS (
          SELECT 1 FROM messages m WHERE m.conversation_id = c.id AND m.content LIKE ?
        ))
        ORDER BY c.is_pinned DESC, c.updated_at DESC LIMIT 100
      `).all(userId, `%${search}%`, `%${search}%`) as ConversationRow[];
    }
    return getDb().prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
        (SELECT m2.content FROM messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.created_at DESC LIMIT 1) as last_message
      FROM conversations c
      WHERE c.user_id = ?
      ORDER BY c.is_pinned DESC, c.updated_at DESC LIMIT 100
    `).all(userId) as ConversationRow[];
  },
  findById(id: string, userId: string): ConversationRow | undefined {
    return getDb().prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(id, userId) as ConversationRow | undefined;
  },
  create(userId: string, title: string, projectId?: string): ConversationRow {
    const id = uuidv4();
    const now = new Date().toISOString();
    getDb().prepare(`
      INSERT INTO conversations (id, user_id, project_id, title, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(id, userId, projectId ?? null, title, now, now);
    return getDb().prepare('SELECT * FROM conversations WHERE id = ?').get(id) as ConversationRow;
  },
  rename(id: string, userId: string, title: string): void {
    getDb().prepare(`UPDATE conversations SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?`)
      .run(title, new Date().toISOString(), id, userId);
  },
  setPinned(id: string, userId: string, pinned: boolean): void {
    getDb().prepare(`UPDATE conversations SET is_pinned = ?, updated_at = ? WHERE id = ? AND user_id = ?`)
      .run(pinned ? 1 : 0, new Date().toISOString(), id, userId);
  },
  delete(id: string, userId: string): void {
    getDb().prepare('DELETE FROM conversations WHERE id = ? AND user_id = ?').run(id, userId);
  },
  countByUser(userId: string): number {
    const row = getDb().prepare('SELECT COUNT(*) as c FROM conversations WHERE user_id = ?').get(userId) as { c: number };
    return row.c;
  },
  touch(id: string): void {
    getDb().prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);
  },
};

// ---------------------------------------------------------------------------
// Message queries
// ---------------------------------------------------------------------------

export const messageQueries = {
  list(conversationId: string): MessageRow[] {
    return getDb().prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(conversationId) as MessageRow[];
  },
  add(conversationId: string, role: string, content: string): MessageRow {
    const id = uuidv4();
    const now = new Date().toISOString();
    getDb().prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, conversationId, role, content, now);
    conversationQueries.touch(conversationId);
    return { id, conversation_id: conversationId, role, content, created_at: now };
  },
};

// ---------------------------------------------------------------------------
// Practice queries
// ---------------------------------------------------------------------------

export const practiceQueries = {
  list(userId: string): PracticeRow[] {
    return getDb().prepare('SELECT * FROM practice_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 50').all(userId) as PracticeRow[];
  },
  create(userId: string, projectId: string, mode: string): PracticeRow {
    const id = uuidv4();
    const now = new Date().toISOString();
    getDb().prepare(`
      INSERT INTO practice_sessions (id, user_id, project_id, mode, status, current_step, total_steps, started_at, time_spent_ms)
      VALUES (?, ?, ?, ?, 'active', 0, 0, ?, 0)
    `).run(id, userId, projectId, mode, now);
    return getDb().prepare('SELECT * FROM practice_sessions WHERE id = ?').get(id) as PracticeRow;
  },
  countByUser(userId: string): number {
    const row = getDb().prepare('SELECT COUNT(*) as c FROM practice_sessions WHERE user_id = ?').get(userId) as { c: number };
    return row.c;
  },
};

// ---------------------------------------------------------------------------
// Analysis queries
// ---------------------------------------------------------------------------

export const analysisQueries = {
  list(userId: string): AnalysisRow[] {
    return getDb().prepare('SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(userId) as AnalysisRow[];
  },
  countByUser(userId: string): number {
    const row = getDb().prepare('SELECT COUNT(*) as c FROM analyses WHERE user_id = ?').get(userId) as { c: number };
    return row.c;
  },
};

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

export function getDashboardStats(userId: string) {
  return {
    projects:         projectQueries.countByUser(userId),
    analyses:         analysisQueries.countByUser(userId),
    conversations:    conversationQueries.countByUser(userId),
    practiceSessions: practiceQueries.countByUser(userId),
  };
}
