import * as connection from '../database.js';
import BodyError from '../errors/BodyError.js';
import ConflictError from '../errors/ConflictError.js';
import * as participantsService from '../services/participantsService.js';
import { participantSchema } from '../validations/participantsValidation.js';

async function postParticipants(req, res) {
    const { name } = req.body;

    const validate = participantSchema.validate({
        name,
    });
    try {
        if (validate.error) {
            throw new BodyError('Name is required');
        }
        await participantsService.create({ name });

        return res.sendStatus(201);
    } catch (error) {
        await connection.closeConnection();

        if (error instanceof BodyError) {
            return res.sendStatus(422);
        }

        if (error instanceof ConflictError) {
            return res.sendStatus(409);
        }
        return res.status(500).send(error);
    }
}

async function getParticipants(req, res) {
    try {
        const participants = await participantsService.find();
        return res.send(participants);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export {
    postParticipants,
    getParticipants,
};
