const Joi = require('joi');

const authorFullName = (parent) =>{
    return parent.first_name + " " + parent.last_name
};

exports.authorValidation = (data) =>{
    const authorSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name:Joi.string(),
        nick_name: Joi.string().min(2).max(20),
        full_name: Joi.string().default(authorFullName),
        email: Joi.string().email().lowercase(),
        phone: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirm_password: Joi.ref('password'),
        info: Joi.string(),
        position: Joi.string(),
        photo: Joi.string().default("/author/avatar.png"),
        is_expert: Joi.boolean().default(false),
        author_is_active: Joi.boolean().default(false),
        gender: Joi.string().valid("Male", "Female"),
        birth_date: Joi.date().less('2000-01-01'),
        birth_year: Joi.number().integer().min(1980).max(2000),
        referred: Joi.boolean().default(false),
        referred_details: Joi.string()
            .when("referred", {
                is: true,
                then: Joi.string().required(),
                otherwise: Joi.string().optional()
        }),
        coding_langs: Joi.array().items(Joi.string(), Joi.number()),
        is_yes: Joi.boolean().truthy("YES", "HA", "OK").valid(true)
    });

    return authorSchema.validate(data, {abortEarly: false});
};