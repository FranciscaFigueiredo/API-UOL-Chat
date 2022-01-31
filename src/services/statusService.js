import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import * as participantsService from './participantsService.js';

async function create({ from }) {
    const searchParticipant = await participantsService.findParticipantByName({ name: from });

    if (!searchParticipant) {
        throw new BodyError('Invalid participant');
    }

    const db = await connection({ column: 'participants' });

    await db.updateOne({ name: from }, { $set: { lastStatus: Date.now() } });

    await closeConnection();

    return true;
}

export {
    create,
};
