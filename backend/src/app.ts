import cors from "cors";
import express from "express";
import { createContainer } from "./config/container.js";
import { TaskController } from "./adapters/controllers/task.controller.js";
import { createTaskRouter } from "./adapters/routes/task.routes.js";
import { errorHandlerMiddleware } from "./adapters/middlewares/error-handler.middleware.js";

export const createApp = () => {
  const app = express();
  const container = createContainer();

  const taskController = new TaskController({
    listTasksUseCase: container.listTasksUseCase,
    createTaskUseCase: container.createTaskUseCase,
    getTaskByIdUseCase: container.getTaskByIdUseCase,
    updateTaskUseCase: container.updateTaskUseCase,
    deleteTaskUseCase: container.deleteTaskUseCase,
  });

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(createTaskRouter(taskController));
  app.use(errorHandlerMiddleware);

  return app;
};
