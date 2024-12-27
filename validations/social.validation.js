const Joi = require("joi");


exports.socialValidation = (data) => {
    const socialSchema = Joi.object({
        social_name: Joi.string().required().trim().min(3),
        social_icon_file: Joi.string().required().trim()
    });

    return socialSchema.validate(data, {abortEarly: false});
};