const Joi = require("joi");


exports.dictValidation = (data) =>{
    const dictSchema = Joi.object({
        term: Joi.string().required().trim(),
        letter: Joi.string().uppercase()
    });

    return dictSchema.validate(data, {abortEarly: false});
}