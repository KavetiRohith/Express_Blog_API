const Joi = require('joi');

const loginValidate = (data) => {
  const schema = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required()
  });

  return schema.validate(data);
}

module.exports = loginValidate;