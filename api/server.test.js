const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbConfig.js");

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
})
describe("server.js", () => {
  beforeAll( async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  })
  describe("POST (/api/auth/register)", () => {
    test("[]", async () => {
      const response = await request(server).POST("/api/auth/register").send();
      expect(response.status).toBe(201);
    })
  })
  describe("POST (/api/auth/login)", () => {
    test("[]", async () => {
      const response = await request(server).POST("/api/auth/login").send();
      expect(response.status).toBe(200);
    })
  })
  describe("GET (/api/jokes)", () => {
    test("[]", async () => {
      const response = await request(server).POST("/api/jokes");
      expect(response.status).toBe(200);
    })
  })
})