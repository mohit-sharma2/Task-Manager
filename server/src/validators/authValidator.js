const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[!@#$%^&*]/, 'special character')
    .required()
    .messages({
      'string.pattern.name': 'Your Password should contains {{#name}}'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
