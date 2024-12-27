const Joi = require('joi');


exports.adminValidation = (data) => {

  const adminSchema = Joi.object({
    name: Joi.string().required().trim().min(3).max(20),
    email: Joi.string().email().required().lowercase(),
    phone: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    password: Joi.string().trim().required().min(6).max(30),
    is_active: Joi.boolean(),
    is_creator: Joi.boolean()
  });

  return adminSchema.validate(data, { abortEarly: false });
}