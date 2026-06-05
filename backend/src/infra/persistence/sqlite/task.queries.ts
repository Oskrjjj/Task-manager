export const CREATE_TASK_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );
`;

export const SELECT_TASK_BASE_SQL =
  "SELECT id, title, completed, created_at, completed_at FROM tasks";
