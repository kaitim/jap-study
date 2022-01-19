const request = require("supertest");

describe("vocab API", () => {
  let server;
  let name;

  const exec = () => {
    return request(server).post("/api/vocabs").send({ name });
  };

  beforeEach(() => {
    server = require("../index");
    name = "heyman";
  });

  afterEach(async () => {
    await request(server).delete("/api/vocabs/1");
    await server.close();
  });

  describe("POST", () => {
    it("return vocab if valid input", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });

    it("return 400 if invalid input length < 5", async () => {
      name = "hey";

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("GET", () => {
    it("get vocab list", async () => {
      await exec();

      const res = await request(server).get("/api/vocabs");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("return vocab if valid input", async () => {
      await exec();

      const res = await request(server).get("/api/vocabs/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });

    it("return 404 if invalid id", async () => {
      await exec();

      const res = await request(server).get("/api/vocabs/2");

      expect(res.status).toBe(404);
    });
  });

  describe("PUT", () => {
    it("return vocab if valid input", async () => {
      await exec();

      const vocab = { name: "japjap" };

      const res = await request(server).put("/api/vocabs/1").send(vocab);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", vocab.name);
    });

    it("return 404 if invalid id", async () => {
      await exec();

      const vocab = { name: "japjap" };

      const res = await request(server).put("/api/vocabs/2").send(vocab);

      expect(res.status).toBe(404);
    });

    it("return 400 if input < 5 length", async () => {
      await exec();

      const vocab = { name: "jap" };

      const res = await request(server).put("/api/vocabs/1").send(vocab);

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE", () => {
    it("return empty if valid id", async () => {
      await exec();

      await request(server).delete("/api/vocabs/1");

      const res = await request(server).get("/api/vocabs");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("return 404 if invalid id", async () => {
      await exec();

      const res = await request(server).delete("/api/vocabs/2");

      expect(res.status).toBe(404);
    });
  });
});
