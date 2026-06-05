import type { Task, TaskFilters, TaskUpdateInput } from "../entities/task.js";

export interface TaskRepositoryPort {
  list(filters: TaskFilters): Task[];
  findById(id: number): Task | null;
  create(title: string): Task;
  update(id: number, input: TaskUpdateInput): Task | null;
  deleteById(id: number): boolean;
}
