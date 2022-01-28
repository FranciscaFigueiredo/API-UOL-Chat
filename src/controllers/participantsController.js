import * as connection from '../database.js';
import { participantSchema } from '../validations/participantsValidation.js';

async function postParticipants(req, res) {
    await connection.mongoClient.connect();
    const db = connection.db.collection('participants');
    const { name } = req.body;

    const validate = participantSchema.validate({
        name,
    });

    if (validate.error) {
        return res.sendStatus(422);
    }

    try {
        const searchParticipant = await db.findOne({ name });

        if (searchParticipant) {
            return res.sendStatus(409);
        }

        await db.insertOne({ name, lastStatus: Date.now() });

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export {
    postParticipants,
};
