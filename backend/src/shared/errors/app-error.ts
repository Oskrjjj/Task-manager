export type AppErrorType = "DOMAIN_ERROR" | "INFRASTRUCTURE_ERROR";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly type: AppErrorType
  ) {
    super(message);
    this.name = "AppError";
  }
}
