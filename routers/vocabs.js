const express = require("express");
const router = express.Router();
const { validate } = require("../model/vocab");

const vocabs = [];

router.get("/", (req, res) => {
  res.send(vocabs);
});

router.get("/:id", (req, res) => {
  const vocab = vocabs.filter((v) => v.id === parseInt(req.params.id))[0];
  if (!vocab) return res.status(404).send("id not found");

  res.send(vocab);
});

router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const vocab = req.body;
  vocab.id = 1;
  vocabs.push(vocab);
  res.send(vocab);
});

router.put("/:id", (req, res) => {
  const vocab = vocabs.find((v) => v.id === parseInt(req.params.id));
  if (!vocab) return res.status(404).send("id not found");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  vocab.name = req.body.name;
  res.send(vocab);
});

router.delete("/:id", (req, res) => {
  const vocab = vocabs.find((v) => v.id === parseInt(req.params.id));
  if (!vocab) return res.status(404).send("id not found");

  const index = vocabs.indexOf(vocab);
  vocabs.splice(index, 1);

  res.send(vocab);
});

module.exports = router;
