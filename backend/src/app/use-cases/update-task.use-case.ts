import type { Task, TaskPatchInput } from "../../domain/entities/task.js";
import type { TaskRepositoryPort } from "../../domain/ports/task-repository.port.js";
import { AppError } from "../../shared/errors/app-error.js";

type Dependencies = {
  taskRepository: TaskRepositoryPort;
};

export class UpdateTaskUseCase {
  constructor(private readonly deps: Dependencies) {}

  execute(id: number, input: TaskPatchInput): Task {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("invalid id", 400, "DOMAIN_ERROR");
    }

    const hasTitle = typeof input.title === "string";
    const hasCompleted = typeof input.completed === "boolean";

    if (!hasTitle && !hasCompleted) {
      throw new AppError("at least one field is required", 400, "DOMAIN_ERROR");
    }

    const titleCandidate = hasTitle ? input.title : undefined;
    const completedCandidate = hasCompleted ? input.completed : undefined;

    if (titleCandidate !== undefined && titleCandidate.trim().length === 0) {
      throw new AppError("title cannot be empty", 400, "DOMAIN_ERROR");
    }

    const existingTask = this.deps.taskRepository.findById(id);

    if (!existingTask) {
      throw new AppError("task not found", 404, "DOMAIN_ERROR");
    }

    const nextTitle = titleCandidate !== undefined ? titleCandidate.trim() : existingTask.title;
    const nextCompleted = completedCandidate !== undefined ? completedCandidate : existingTask.completed;

    const updatedTask = this.deps.taskRepository.update(id, {
      title: nextTitle,
      completed: nextCompleted
    });

    if (!updatedTask) {
      throw new AppError("task not found", 404, "DOMAIN_ERROR");
    }

    return updatedTask;
  }
}
