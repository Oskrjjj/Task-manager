import { CreateTaskUseCase } from "../app/use-cases/create-task.use-case.js";
import { DeleteTaskUseCase } from "../app/use-cases/delete-task.use-case.js";
import { GetTaskByIdUseCase } from "../app/use-cases/get-task-by-id.use-case.js";
import { ListTasksUseCase } from "../app/use-cases/list-tasks.use-case.js";
import { UpdateTaskUseCase } from "../app/use-cases/update-task.use-case.js";
import { createDatabase } from "./database.js";
import { SqliteTaskRepository } from "../infra/persistence/sqlite/sqlite-task.repository.js";

export const createContainer = () => {
  const db = createDatabase();
  const taskRepository = new SqliteTaskRepository(db);

  const listTasksUseCase = new ListTasksUseCase({ taskRepository });
  const getTaskByIdUseCase = new GetTaskByIdUseCase({ taskRepository });
  const createTaskUseCase = new CreateTaskUseCase({ taskRepository });
  const updateTaskUseCase = new UpdateTaskUseCase({ taskRepository });
  const deleteTaskUseCase = new DeleteTaskUseCase({ taskRepository });

  return {
    listTasksUseCase,
    createTaskUseCase,
    getTaskByIdUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
  };
};
