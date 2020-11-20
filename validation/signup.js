const Joi = require('joi');

const signupValidate = (data) => {
  const schema = Joi.object({
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
  });

  return schema.validate(data);
}

module.exports = signupValidate;