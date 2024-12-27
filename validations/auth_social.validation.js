const Joi = require('joi');


exports.authSocialValidation = (data) =>{

    const authSocialSchema = Joi.object({
        author_id: Joi.string().alphanum().message("Invalid author Id"),
        social_id: Joi.string().alphanum().message("Invalid social Id"),
        social_link: Joi.string().trim().required()
    });

    return authSocialSchema.validate(data, {abortEarly: false});
}