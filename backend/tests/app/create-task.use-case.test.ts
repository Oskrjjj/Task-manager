import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CreateTaskUseCase } from "../../src/app/use-cases/create-task.use-case.js";
import type { Task } from "../../src/domain/entities/task.js";
import type { TaskRepositoryPort } from "../../src/domain/ports/task-repository.port.js";
import { AppError } from "../../src/shared/errors/app-error.js";

class InMemoryTaskRepositoryStub implements TaskRepositoryPort {
  private sequence = 1;
  private readonly items = new Map<number, Task>();

  list(): Task[] {
    return Array.from(this.items.values());
  }

  findById(id: number): Task | null {
    return this.items.get(id) ?? null;
  }

  create(title: string): Task {
    const task: Task = {
      id: this.sequence,
      title,
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      completedAt: null,
    };

    this.items.set(this.sequence, task);
    this.sequence += 1;

    return task;
  }

  update(
    id: number,
    input: { title: string; completed: boolean }
  ): Task | null {
    const task = this.items.get(id);

    if (!task) {
      return null;
    }

    const nextTask: Task = {
      ...task,
      title: input.title,
      completed: input.completed,
      completedAt: input.completed ? "2026-01-01T00:00:00.000Z" : null,
    };

    this.items.set(id, nextTask);
    return nextTask;
  }

  deleteById(id: number): boolean {
    return this.items.delete(id);
  }
}

describe("CreateTaskUseCase", () => {
  it("creates a task when title is valid", () => {
    // Arrange
    const repository = new InMemoryTaskRepositoryStub();
    const useCase = new CreateTaskUseCase({ taskRepository: repository });

    // Act
    const result = useCase.execute("Write architecture docs");

    // Assert
    assert.equal(result.id, 1);
    assert.equal(result.title, "Write architecture docs");
    assert.equal(result.completed, false);
  });

  it("throws domain error when title is blank", () => {
    // Arrange
    const repository = new InMemoryTaskRepositoryStub();
    const useCase = new CreateTaskUseCase({ taskRepository: repository });

    // Act + Assert
    assert.throws(
      () => useCase.execute("   "),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.message, "title is required");
        assert.equal(error.statusCode, 400);
        assert.equal(error.type, "DOMAIN_ERROR");
        return true;
      }
    );
  });
});
