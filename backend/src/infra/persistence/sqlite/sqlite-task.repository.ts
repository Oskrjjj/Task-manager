import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type {
  Task,
  TaskFilters,
  TaskUpdateInput,
} from "../../../domain/entities/task.js";
import type { TaskRepositoryPort } from "../../../domain/ports/task-repository.port.js";
import { AppError } from "../../../shared/errors/app-error.js";
import {
  CREATE_TASK_TABLE_SQL,
  DELETE_TASK_SQL,
  INSERT_TASK_SQL,
  SELECT_LAST_INSERTED_TASK_SQL,
  SELECT_TASK_BASE_SQL,
  SELECT_TASK_BY_ID_SQL,
  UPDATE_TASK_SQL,
} from "./task.queries.js";

type TaskRow = {
  id: number;
  title: string;
  completed: number;
  created_at: string;
  completed_at: string | null;
};

const mapRowToTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  completed: row.completed === 1,
  createdAt: row.created_at,
  completedAt: row.completed_at,
});

export class SqliteTaskRepository implements TaskRepositoryPort {
  constructor(private readonly db: DatabaseSync) {
    this.db.exec(CREATE_TASK_TABLE_SQL);
  }

  list(filters: TaskFilters): Task[] {
    const whereClauses: string[] = [];
    const params: SQLInputValue[] = [];

    if (typeof filters.completed === "boolean") {
      whereClauses.push("completed = ?");
      params.push(filters.completed ? 1 : 0);
    }

    if (filters.search) {
      whereClauses.push("LOWER(title) LIKE ?");
      params.push(`%${filters.search.toLowerCase()}%`);
    }

    const whereQuery =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const query = `${SELECT_TASK_BASE_SQL} ${whereQuery} ORDER BY completed ASC, id DESC`;
    const rows = this.db.prepare(query).all(...params) as TaskRow[];

    return rows.map(mapRowToTask);
  }

  findById(id: number): Task | null {
    const row = this.db.prepare(SELECT_TASK_BY_ID_SQL).get(id) as
      | TaskRow
      | undefined;

    if (!row) {
      return null;
    }

    return mapRowToTask(row);
  }

  create(title: string): Task {
    const createdAt = new Date().toISOString();

    this.db.prepare(INSERT_TASK_SQL).run(title, createdAt);

    const row = this.db.prepare(SELECT_LAST_INSERTED_TASK_SQL).get() as
      | TaskRow
      | undefined;

    if (!row) {
      throw new AppError(
        "could not read created task",
        500,
        "INFRASTRUCTURE_ERROR"
      );
    }

    return mapRowToTask(row);
  }

  update(id: number, input: TaskUpdateInput): Task | null {
    const completedAt = input.completed ? new Date().toISOString() : null;
    const completed = input.completed ? 1 : 0;
    const result = this.db
      .prepare(UPDATE_TASK_SQL)
      .run(input.title, completed, completedAt, id);

    if (result.changes === 0) {
      return null;
    }

    const row = this.db.prepare(SELECT_TASK_BY_ID_SQL).get(id) as
      | TaskRow
      | undefined;

    if (!row) {
      return null;
    }

    return mapRowToTask(row);
  }

  deleteById(id: number): boolean {
    const result = this.db.prepare(DELETE_TASK_SQL).run(id);
    return result.changes > 0;
  }
}
