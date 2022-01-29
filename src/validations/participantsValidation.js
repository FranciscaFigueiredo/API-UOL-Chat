import joi from 'joi';

const participantSchema = joi.object({
    name: joi.string().required(),
});

export {
    participantSchema,
};
