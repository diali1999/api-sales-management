const Joi = require('@hapi/joi');

//User validation

const passwordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string()
                    .min(8)
                    .required(),
    });
    return schema.validate(data);
}

module.exports = passwordValidation;