const Joi = require("joi");


exports.categoryValidation = (data) =>{

    const categorySchema = Joi.object({
        category_name: Joi.string().min(5).message("Category must be longer than 3 letters")
            .max(50).message("Category cannot be longer than 50 letters")
            .required().messages({
                "string.empty":"Category cannot be empty string",
                "any.required":"Category must be entered"
            }),
        parent_category_id: Joi.string().alphanum().message("Invalid Id")
    });


    return categorySchema.validate(data, {abortEarly: false});
}