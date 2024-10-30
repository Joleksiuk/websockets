import app from "../src/app";
import { testPort } from "../src/config";
import { AppDataSource } from "../src/data-source";
import request from "supertest";

let connection, server;

beforeEach(async () => {
  connection = await AppDataSource.initialize();
  await connection.synchronize(true);
  server = app.listen(testPort);
});

afterEach(async () => {
  await connection.close();
  server.close();
});

it("should be no users initially", async () => {
  const response = await request(server).get("/users");
  expect(response.body).toEqual([]);
});

it("should create a new user", async () => {
  const testUser = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
  };

  const response = await request(server).post("/users").send(testUser);

  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({ ...testUser, id: expect.any(Number) });
});

it("should not create a new user without given firstName", async () => {
  const testUser = {
    lastName: "Doe",
    age: 30,
  };

  const response = await request(server).post("/users").send(testUser);
  expect(response.statusCode).toBe(400);
});
