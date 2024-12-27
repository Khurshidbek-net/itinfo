const Joi = require('joi');

exports.userValidation = (data) =>{
    
    const userSchema = Joi.object({
        name: Joi.string().required().trim().min(3).max(20),
        email: Joi.string().required().trim().lowercase().email(),
        password: Joi.string().min(6).max(30).required(),
        info: Joi.string(),
        photo: Joi.string().trim(),
        is_user_active: Joi.boolean()
    });

    return userSchema.validate(data, {abortEarly: false});
}