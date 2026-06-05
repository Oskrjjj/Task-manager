import type { Task } from "../../domain/entities/task.js";
import type { TaskRepositoryPort } from "../../domain/ports/task-repository.port.js";
import { AppError } from "../../shared/errors/app-error.js";

type Dependencies = {
  taskRepository: TaskRepositoryPort;
};

export class GetTaskByIdUseCase {
  constructor(private readonly deps: Dependencies) {}

  execute(id: number): Task {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("invalid id", 400, "DOMAIN_ERROR");
    }

    const task = this.deps.taskRepository.findById(id);

    if (!task) {
      throw new AppError("task not found", 404, "DOMAIN_ERROR");
    }

    return task;
  }
}
