const Joi = require("Joi");

function validateVocab(vocab) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  return schema.validate(vocab);
}

exports.validate = validateVocab;
