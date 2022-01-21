const Joi = require("Joi");
const mongoose = require("mongoose");

const vocabSchema = new mongoose.Schema({
  word: { type: String, required: true },
  kanji: String,
  example: String,
  meaning: String,
  type: String,
  chapter: Number,
  tags: Array,
});

const Vocab = mongoose.model("vocab", vocabSchema);

function validateVocab(vocab) {
  const schema = Joi.object({
    word: Joi.string().min(5).required(),
  });
  return schema.validate(vocab);
}

exports.Vocab = Vocab;
exports.validate = validateVocab;
