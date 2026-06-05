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
export const INSERT_TASK_SQL =
  "INSERT INTO tasks (title, completed, created_at, completed_at) VALUES (?, 0, ?, NULL)";

export const SELECT_LAST_INSERTED_TASK_SQL = `${SELECT_TASK_BASE_SQL} WHERE id = last_insert_rowid()`;

export const SELECT_TASK_BY_ID_SQL = `${SELECT_TASK_BASE_SQL} WHERE id = ?`;

export const UPDATE_TASK_SQL =
  "UPDATE tasks SET title = ?, completed = ?, completed_at = ? WHERE id = ?";

export const DELETE_TASK_SQL = "DELETE FROM tasks WHERE id = ?";
