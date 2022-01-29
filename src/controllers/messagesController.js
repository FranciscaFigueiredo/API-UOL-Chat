import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import { findParticipantByName } from '../services/participantsService.js';
import { messageSchema } from '../validations/messagesValidation.js';

async function postMessage(req, res) {
    const {
        to,
        text,
        type,
    } = req.body;

    const validate = messageSchema.validate({
        to,
        text,
        type,
    });

    try {
        if (validate.error) {
            throw new BodyError(validate.error.message);
        }
        const from = req.headers?.user;

        const db = await connection({ column: 'messages' });

        const searchParticipant = await findParticipantByName({ name: from });

        if (!searchParticipant) {
            throw new BodyError('Invalid participant');
        }

        await db.insertOne({
            to,
            text,
            type,
        });

        await closeConnection();
        return res.sendStatus(201);
    } catch (error) {
        await closeConnection();

        if (error instanceof BodyError) {
            return res.sendStatus(422);
        }

        return res.status(500).send(error);
    }
}

export {
    postMessage,
};
