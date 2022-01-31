import { closeConnection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
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

async function deleteMessageById(req, res) {
    const name = req.headers?.user;
    const { id } = req.params;

    try {
        const messages = await messagesService.deleteById({ name, id });

        await closeConnection();
        return res.send(messages);
    } catch (error) {
        await closeConnection();

        if (error instanceof UnauthorizedError) {
            return res.sendStatus(401);
        }

        if (error instanceof NotFoundError) {
            return res.sendStatus(404);
        }

        return res.status(500).send(error);
    }
}

export {
    postMessage,
    getMessages,
    deleteMessageById,
};
