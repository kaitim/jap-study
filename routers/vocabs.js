const express = require("express");
const router = express.Router();
const { validate, Vocab } = require("../model/vocab");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/clearAll", async (req, res) => {
  await Vocab.deleteMany({});
  res.status(200).send("clear all");
});

router.get("/", async (req, res) => {
  const vocabs = await Vocab.find();
  res.send(vocabs);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const vocab = await Vocab.findById(req.params.id);
  if (!vocab) return res.status(404).send("id not found");

  res.send(vocab);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let vocab = new Vocab({
    word: req.body.word,
  });
  vocab = await vocab.save();

  res.send(vocab);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let vocab = await Vocab.findById(req.params.id);
  if (!vocab) return res.status(404).send("id not found");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  vocab.word = req.body.word;

  vocab = await vocab.save(); //query first

  res.send(vocab);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const vocab = await Vocab.findByIdAndRemove(req.params.id);

  res.send(vocab);
});

module.exports = router;
