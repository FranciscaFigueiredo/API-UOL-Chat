import * as connection from '../database.js';

async function postParticipants(req, res) {
    await connection.mongoClient.connect();

    res.sendStatus(201);
}

export {
    postParticipants,
};
