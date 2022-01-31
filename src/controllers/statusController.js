import { closeConnection } from '../database.js';
import NotFoundError from '../errors/NotFoundError.js';
import * as statusService from '../services/statusService.js';

async function postStatus(req, res) {
    const from = req.headers?.user;

    try {
        await statusService.create({ from });

        await closeConnection();
        return res.sendStatus(200);
    } catch (error) {
        await closeConnection();

        if (error instanceof NotFoundError) {
            return res.sendStatus(404);
        }

        return res.status(500).send(error);
    }
}

export {
    postStatus,
};
