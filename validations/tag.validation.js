const Joi = require("joi");


exports.tagValidation = (data) =>{

    const tagSchema = Joi.object({
        topic_id: Joi.string().alphanum().message("Invalid topic Id").required().trim(),
        category_id: Joi.string().alphanum().message("Invalid category Id").required().trim()
    });


    return tagSchema.validate(data, {abortEarly: false});
}