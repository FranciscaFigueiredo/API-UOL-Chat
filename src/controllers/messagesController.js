import { closeConnection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import * as messagesService from '../services/messagesService.js';

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

        await messagesService.create({
            from,
            to,
            text,
            type,
        });

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
    const limit = Number(req.query.limit);

    try {
        const messages = await messagesService.find({ from, limit });

        await closeConnection();
        return res.send(messages);
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
    getMessages,
};
