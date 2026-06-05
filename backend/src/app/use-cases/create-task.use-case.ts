import type { Task } from "../../domain/entities/task.js";
import type { TaskRepositoryPort } from "../../domain/ports/task-repository.port.js";
import { AppError } from "../../shared/errors/app-error.js";

type Dependencies = {
  taskRepository: TaskRepositoryPort;
};

export class CreateTaskUseCase {
  constructor(private readonly deps: Dependencies) {}

  execute(title: string): Task {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new AppError("title is required", 400, "DOMAIN_ERROR");
    }

    return this.deps.taskRepository.create(normalizedTitle);
  }
}
