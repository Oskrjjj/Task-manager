import type { Task, TaskFilters } from "../../domain/entities/task.js";
import type { TaskRepositoryPort } from "../../domain/ports/task-repository.port.js";

type Dependencies = {
  taskRepository: TaskRepositoryPort;
};

export class ListTasksUseCase {
  constructor(private readonly deps: Dependencies) {}

  execute(filters: TaskFilters): Task[] {
    return this.deps.taskRepository.list(filters);
  }
}
