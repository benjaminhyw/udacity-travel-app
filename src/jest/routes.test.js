const request = require("supertest");
const app = require("../server/server");
const regeneratorRuntime = require("regenerator-runtime");

test("Should successfully provide a 200 status code", async () => {
  const res = await request(app).post("/add").send({ city: "london" });

  expect(res.status).toEqual(200);
});
