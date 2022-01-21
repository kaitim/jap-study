const request = require("supertest");
const { Vocab } = require("../model/vocab");
const mongoose = require("mongoose");

describe("vocab API", () => {
  let server;
  let vocab;
  let word;
  let newVocab;

  const exec = () => {
    return request(server).post("/api/vocabs").send({ word });
  };

  const execUpdate = () => {
    return request(server)
      .put("/api/vocabs/" + vocab._id)
      .send(newVocab);
  };

  beforeEach(async () => {
    server = require("../index");
    word = "heyman";
    newVocab = { word: "japjap" };

    vocab = new Vocab({ word: "first" });
    vocab = await vocab.save();
  });

  afterEach(async () => {
    await Vocab.deleteMany({});
    await server.close();
  });

  describe("POST", () => {
    it("return vocab if valid input", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("word", word);
    });

    it("db should contain vocab if valid input", async () => {
      const res = await exec();

      const vocabInDb = await Vocab.findById(res.body._id);
      expect(vocabInDb).not.toBeNull();
    });

    it("return 400 if invalid input length < 5", async () => {
      word = "hey";

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("GET", () => {
    it("get vocab list", async () => {
      const res = await request(server).get("/api/vocabs");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("return vocab if valid input", async () => {
      const res = await request(server).get("/api/vocabs/" + vocab._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("word", "first");
    });

    it("return 400 if invalid object id", async () => {
      const res = await request(server).get("/api/vocabs/1");

      expect(res.status).toBe(400);
    });

    it("return 404 if id not found", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/vocabs/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT", () => {
    it("return vocab if valid input", async () => {
      const res = await execUpdate();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("word", newVocab.word);
    });

    it("db updated if valid input", async () => {
      await execUpdate();

      const vocabInDb = await Vocab.findById(vocab._id);
      expect(vocabInDb.name).toBe(newVocab.name);
    });

    it("return 400 if invalid object id", async () => {
      const res = await request(server).put("/api/vocabs/1").send(newVocab);

      expect(res.status).toBe(400);
    });

    it("return 404 if invalid id", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server)
        .put("/api/vocabs/" + id)
        .send(newVocab);

      expect(res.status).toBe(404);
    });

    it("return 400 if input < 5 length", async () => {
      const newVocab = { name: "jap" };

      const res = await request(server)
        .put("/api/vocabs/" + vocab._id)
        .send(newVocab);

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE", () => {
    it("return deleted vocab if valid id", async () => {
      await exec();

      const res = await request(server).delete("/api/vocabs/" + vocab._id);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(vocab._id.toHexString());
    });

    it("update db if valid id", async () => {
      await exec();

      await request(server).delete("/api/vocabs/" + vocab._id);

      const res = await Vocab.findById(vocab._id);

      expect(res).toBeNull();
    });

    it("return 400 if invalid id", async () => {
      await exec();

      const res = await request(server).delete("/api/vocabs/1");

      expect(res.status).toBe(400);
    });

    it("return empty object if not found id", async () => {
      await exec();

      const res = await request(server).delete(
        "/api/vocabs/" + new mongoose.Types.ObjectId()
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({});
    });
  });
});
