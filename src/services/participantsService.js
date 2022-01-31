import { closeConnection, connection } from '../database.js';
import ConflictError from '../errors/ConflictError.js';

import * as messagesService from './messagesService.js';

async function findParticipantByName({ name }) {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await db.findOne({ name });

    return searchParticipant;
}

async function create({ name }) {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await findParticipantByName({ name });

    if (searchParticipant) {
        throw new ConflictError();
    }

    await db.insertOne({ name, lastStatus: Date.now() });

    await messagesService.create({
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
    });

    await closeConnection();
}

async function find() {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await db.find({}).toArray();

    await closeConnection();

    return searchParticipant;
}

export {
    create,
    find,
    findParticipantByName,
};
