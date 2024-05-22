const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbConfig.js");

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
})
describe("server.js", () => {
  const Takenoko = {username: "Takenoko", password: "bamboo"};
  const username = {username: "Takenoko"}
  beforeAll( async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  })
  beforeEach( async () => {
    await db("users").truncate();
  })
  describe("POST (/api/auth/register)", () => {
    test("[1] returns correct status and message on success", async () => {
      const response = await request(server).post("/api/auth/register").send(Takenoko);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(username);
      expect(response.body).toHaveProperty("password");
    })
    test("[2] returns correct status and message on failure", async () => {
      let response = await request(server).post("/api/auth/register").send({username: "Takenoko", password: ""});
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({message: "username and password are required"});
      response = await request(server).post("/api/auth/register").send({username: "", password: "bamboo"});
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({message: "username and password are required"});
      await request(server).post("/api/auth/register").send(Takenoko);
      response = await request(server).post("/api/auth/register").send(Takenoko);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({message: "username taken"});
    })
  })
  describe("POST (/api/auth/login)", () => {
    
    test("[3] returns correct status and body on success", async () => {
      await request(server).post("/api/auth/register").send(Takenoko);
      const response = await request(server).post("/api/auth/login").send(Takenoko);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({message: "welcome, Takenoko"});
      expect(response.body).toHaveProperty("token");
    })
    test("[4] returns correct status and message on failure", async () => {
      let response = await request(server).post("/api/auth/login").send({username: "Takenoko", password: ""});
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({message: "username and password are required"});
      response = await request(server).post("/api/auth/login").send(Takenoko);
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({message: "invalid credentials"});
    })
  })
  describe("GET (/api/jokes)", () => {
    test("[5] request without token returns correct error status code", async () => {
      const response = await request(server).get("/api/jokes");
      expect(response.status).toBe(401);
    })
    test("[6] request without token returns correct error message", async () => {
      const response = await request(server).get("/api/jokes");
      expect(response.body).toMatchObject({message: "token required"});
    })
  })
})