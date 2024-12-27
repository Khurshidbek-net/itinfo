const Joi = require("joi");

exports.sysnonymValidation = (data) =>{

    const synonymSchema = Joi.object({
        desc_id: Joi.string().alphanum().message("Invalid description Id"),
        dict_id: Joi.string().alphanum().message("Invalid dictionary Id")
    });

    return synonymSchema.validate(data, {abortEarly: false});
}