const Joi = require('joi');

const validate = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
  });

  return schema.validate(data);
}

module.exports = validate;