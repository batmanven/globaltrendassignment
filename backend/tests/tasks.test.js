import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Task from "../models/Task.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("Task API", () => {
  it("should create a new task", async () => {
    const res = await request(app).post("/tasks").send({ title: "Test Task" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Task");
  });

  it("should return error if title is missing", async () => {
    const res = await request(app).post("/tasks").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should get all tasks", async () => {
    await Task.create({ title: "Task 1" });
    await Task.create({ title: "Task 2" });

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should delete a task", async () => {
    const task = await Task.create({ title: "To Delete" });  const res = await request(app).delete(`/tasks/${task._id}`);

expect(res.status).toBe(200);
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});
