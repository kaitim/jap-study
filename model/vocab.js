const Joi = require("Joi");
const mongoose = require("mongoose");

const vocabSchema = new mongoose.Schema({
  name: String,
});

const Vocab = mongoose.model("vocab", vocabSchema);

function validateVocab(vocab) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  return schema.validate(vocab);
}

exports.Vocab = Vocab;
exports.validate = validateVocab;
