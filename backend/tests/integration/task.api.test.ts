import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";
import { createApp } from "../../src/app.js";

describe("Task API integration", () => {
  it("supports full CRUD lifecycle", async () => {
    process.env.DB_PATH = ":memory:";
    const app = createApp();

    // Act - create
    const createResponse = await request(app)
      .post("/tasks")
      .set("Content-Type", "application/json")
      .send({ title: "Prepare demo" });

    // Assert - create
    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.title, "Prepare demo");
    assert.equal(createResponse.body.completed, false);
    assert.equal(typeof createResponse.body.id, "number");
    const taskId = createResponse.body.id as number;

    // Act - get by id
    const getResponse = await request(app).get(`/tasks/${taskId}`);

    // Assert - get by id
    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.id, taskId);
    assert.equal(getResponse.body.title, "Prepare demo");

    // Act - update
    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Content-Type", "application/json")
      .send({ title: "Prepare final demo", completed: true });

    // Assert - update
    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.title, "Prepare final demo");
    assert.equal(updateResponse.body.completed, true);
    assert.equal(typeof updateResponse.body.completedAt, "string");

    // Act - list filtered completed
    const listResponse = await request(app)
      .get("/tasks")
      .query({ completed: "true" });

    // Assert - list filtered completed
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(listResponse.body), true);
    assert.equal(listResponse.body.length, 1);
    assert.equal(listResponse.body[0].id, taskId);

    // Act - delete
    const deleteResponse = await request(app).delete(`/tasks/${taskId}`);

    // Assert - delete
    assert.equal(deleteResponse.status, 204);

    // Act - get deleted
    const getDeletedResponse = await request(app).get(`/tasks/${taskId}`);

    // Assert - get deleted
    assert.equal(getDeletedResponse.status, 404);
    assert.equal(getDeletedResponse.body.type, "DOMAIN_ERROR");
    assert.equal(getDeletedResponse.body.message, "task not found");
  });

  it("returns consistent domain errors for invalid input", async () => {
    // Arrange
    process.env.DB_PATH = ":memory:";
    const app = createApp();

    // Act - invalid create
    const invalidCreate = await request(app)
      .post("/tasks")
      .set("Content-Type", "application/json")
      .send({ title: "   " });

    // Assert - invalid create
    assert.equal(invalidCreate.status, 400);
    assert.equal(invalidCreate.body.type, "DOMAIN_ERROR");
    assert.equal(invalidCreate.body.message, "title is required");

    // Act - invalid update payload
    const invalidUpdate = await request(app)
      .put("/tasks/1")
      .set("Content-Type", "application/json")
      .send({});

    // Assert - invalid update payload
    assert.equal(invalidUpdate.status, 400);
    assert.equal(invalidUpdate.body.type, "DOMAIN_ERROR");
    assert.equal(invalidUpdate.body.message, "at least one field is required");

    // Act - invalid id
    const invalidId = await request(app).get("/tasks/0");

    // Assert - invalid id
    assert.equal(invalidId.status, 400);
    assert.equal(invalidId.body.type, "DOMAIN_ERROR");
    assert.equal(invalidId.body.message, "invalid id");
  });
});
