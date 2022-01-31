import joi from 'joi';

const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().pattern(/^message$|^private_message$/),
});

export {
    messageSchema,
};
