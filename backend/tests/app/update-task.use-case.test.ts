import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UpdateTaskUseCase } from "../../src/app/use-cases/update-task.use-case.js";
import type { Task } from "../../src/domain/entities/task.js";
import type { TaskRepositoryPort } from "../../src/domain/ports/task-repository.port.js";
import { AppError } from "../../src/shared/errors/app-error.js";

class InMemoryTaskRepositoryStub implements TaskRepositoryPort {
  constructor(private readonly items: Map<number, Task>) {}

  list(): Task[] {
    return Array.from(this.items.values());
  }

  findById(id: number): Task | null {
    return this.items.get(id) ?? null;
  }

  create(title: string): Task {
    const task: Task = {
      id: 999,
      title,
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      completedAt: null,
    };

    this.items.set(task.id, task);
    return task;
  }

  update(
    id: number,
    input: { title: string; completed: boolean }
  ): Task | null {
    const previous = this.items.get(id);

    if (!previous) {
      return null;
    }

    const next: Task = {
      ...previous,
      title: input.title,
      completed: input.completed,
      completedAt: input.completed ? "2026-01-02T00:00:00.000Z" : null,
    };

    this.items.set(id, next);
    return next;
  }

  deleteById(id: number): boolean {
    return this.items.delete(id);
  }
}

describe("UpdateTaskUseCase", () => {
  it("updates title and completion state", () => {
    // Arrange
    const items = new Map<number, Task>([
      [
        1,
        {
          id: 1,
          title: "Draft PR",
          completed: false,
          createdAt: "2026-01-01T00:00:00.000Z",
          completedAt: null,
        },
      ],
    ]);
    const repository = new InMemoryTaskRepositoryStub(items);
    const useCase = new UpdateTaskUseCase({ taskRepository: repository });

    // Act
    const result = useCase.execute(1, {
      title: "Draft PR v2",
      completed: true,
    });

    // Assert
    assert.equal(result.title, "Draft PR v2");
    assert.equal(result.completed, true);
    assert.equal(result.completedAt, "2026-01-02T00:00:00.000Z");
  });

  it("throws domain error when id is invalid", () => {
    // Arrange
    const repository = new InMemoryTaskRepositoryStub(new Map());
    const useCase = new UpdateTaskUseCase({ taskRepository: repository });

    // Act + Assert
    assert.throws(
      () => useCase.execute(0, { title: "x" }),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.message, "invalid id");
        assert.equal(error.statusCode, 400);
        return true;
      }
    );
  });

  it("throws domain error when no fields are informed", () => {
    // Arrange
    const items = new Map<number, Task>([
      [
        1,
        {
          id: 1,
          title: "Initial",
          completed: false,
          createdAt: "2026-01-01T00:00:00.000Z",
          completedAt: null,
        },
      ],
    ]);
    const repository = new InMemoryTaskRepositoryStub(items);
    const useCase = new UpdateTaskUseCase({ taskRepository: repository });

    // Act + Assert
    assert.throws(
      () => useCase.execute(1, {}),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.message, "at least one field is required");
        assert.equal(error.statusCode, 400);
        return true;
      }
    );
  });
});
