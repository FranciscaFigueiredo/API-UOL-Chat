import dayjs from 'dayjs';
import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import * as messagesService from '../services/messagesService.js';
import * as participantsService from '../services/participantsService.js';
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

        const searchParticipant = await participantsService.findParticipantByName({ name: from });

        if (!searchParticipant) {
            throw new BodyError('Invalid participant');
        }
        const time = dayjs().locale('pt-Br').format('HH:mm:ss');

        await db.insertOne({
            from,
            to,
            text,
            type,
            time,
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

async function getMessages(req, res) {
    const from = req.headers?.user;
    try {
        const messages = await messagesService.findMessages({ from });

        await closeConnection();
        return res.send(messages);
    } catch (error) {
        await closeConnection();
        return res.status(500).send(error);
    }
}

export {
    postMessage,
    getMessages,
};
