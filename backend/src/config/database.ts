import { DatabaseSync } from "node:sqlite";

export const createDatabase = (): DatabaseSync => {
  const databasePath = process.env.DB_PATH ?? "data/tasks.db";
  return new DatabaseSync(databasePath);
};
