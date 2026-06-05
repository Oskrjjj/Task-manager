import { Router } from "express";
import type { TaskController } from "../controllers/task.controller.js";

export const createTaskRouter = (taskController: TaskController): Router => {
  const router = Router();

  router.get("/tasks", taskController.list);
  router.get("/tasks/:id", taskController.getById);
  router.post("/tasks", taskController.create);
  router.put("/tasks/:id", taskController.update);
  router.delete("/tasks/:id", taskController.delete);
  router.patch("/tasks/:id/complete", taskController.complete);

  return router;
};
