import cors from "cors";
import express from "express";
import { errorHandlerMiddleware } from "./adapters/http/middlewares/error-handler.middleware.js";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(errorHandlerMiddleware);

  return app;
};
