const Joi = require("joi");

exports.descValidation = (data) =>{

    const descSchema = Joi.object({
        category_id: Joi.string().alphanum().message("Invalid category Id"),
        description: Joi.string().trim().required().min(30).max(500)
    });

    return descSchema.validate(data, {abortEarly: false});

}