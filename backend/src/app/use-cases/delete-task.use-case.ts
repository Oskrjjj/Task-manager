import type { TaskRepositoryPort } from "../../domain/ports/task-repository.port.js";
import { AppError } from "../../shared/errors/app-error.js";

type Dependencies = {
  taskRepository: TaskRepositoryPort;
};

export class DeleteTaskUseCase {
  constructor(private readonly deps: Dependencies) {}

  execute(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("invalid id", 400, "DOMAIN_ERROR");
    }

    const deleted = this.deps.taskRepository.deleteById(id);

    if (!deleted) {
      throw new AppError("task not found", 404, "DOMAIN_ERROR");
    }
  }
}
