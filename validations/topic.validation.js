const Joi = require("joi");


exports.topicValidation = (data) =>{

    const topicSchema = Joi.object({
        author_id: Joi.string().alphanum().message("Invaid author id"),
        topic_title: Joi.string().required().trim(),
        topic_text: Joi.string().required().trim(),
        is_checked: Joi.boolean().required().default(false),
        is_approved: Joi.boolean().default(false),
        expert_id: Joi.string().alphanum().message("Invalid author Id")
    });


    return topicSchema.validate(data, {abortEarly: false});
}