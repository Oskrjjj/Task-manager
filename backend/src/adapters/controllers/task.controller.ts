import type { NextFunction, Request, Response } from "express";
import type { CreateTaskUseCase } from "../../app/use-cases/create-task.use-case.js";
import type { DeleteTaskUseCase } from "../../app/use-cases/delete-task.use-case.js";
import type { GetTaskByIdUseCase } from "../../app/use-cases/get-task-by-id.use-case.js";
import type { ListTasksUseCase } from "../../app/use-cases/list-tasks.use-case.js";
import type { UpdateTaskUseCase } from "../../app/use-cases/update-task.use-case.js";
import { mapQueryToTaskFilters } from "../mappers/task-filters.mapper.js";

type Dependencies = {
  listTasksUseCase: ListTasksUseCase;
  createTaskUseCase: CreateTaskUseCase;
  getTaskByIdUseCase: GetTaskByIdUseCase;
  updateTaskUseCase: UpdateTaskUseCase;
  deleteTaskUseCase: DeleteTaskUseCase;
};

export class TaskController {
  constructor(private readonly deps: Dependencies) {}

  list = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tasks = this.deps.listTasksUseCase.execute(
        mapQueryToTaskFilters({
          completed: req.query.completed,
          search: req.query.search,
        })
      );

      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.deps.getTaskByIdUseCase.execute(Number(req.params.id));
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const title = typeof req.body?.title === "string" ? req.body.title : "";
      const task = this.deps.createTaskUseCase.execute(title);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const title =
        typeof req.body?.title === "string" ? req.body.title : undefined;
      const completed =
        typeof req.body?.completed === "boolean"
          ? req.body.completed
          : undefined;
      const task = this.deps.updateTaskUseCase.execute(Number(req.params.id), {
        title,
        completed,
      });
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.deps.deleteTaskUseCase.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  complete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.deps.updateTaskUseCase.execute(Number(req.params.id), {
        completed: true,
      });
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}
