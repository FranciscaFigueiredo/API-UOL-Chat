import { closeConnection, connection } from '../database.js';
import ConflictError from '../errors/ConflictError.js';

// eslint-disable-next-line import/no-cycle
import * as messagesService from './messagesService.js';

async function findParticipantByName({ name }) {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await db.findOne({ name });

    return searchParticipant;
}

async function sendStatusMessage({ from, text }) {
    await messagesService.sendMessage({
        from,
        to: 'Todos',
        text,
        type: 'status',
    });
}

async function create({ name }) {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await findParticipantByName({ name });

    if (searchParticipant) {
        throw new ConflictError();
    }

    await db.insertOne({ name, lastStatus: Date.now() });

    await sendStatusMessage({ from: name, text: 'entra na sala...' });

    await closeConnection();
}

async function find() {
    const db = await connection({ column: 'participants' });

    const searchParticipant = await db.find({}).toArray();

    await closeConnection();

    return searchParticipant;
}

async function remove() {
    const db = await connection({ column: 'participants' });

    const time = Date.now() - 10000;

    const searchParticipants = await db.find({ lastStatus: { $lt: time } }).toArray();

    searchParticipants.forEach((participant) => {
        sendStatusMessage({ from: participant.name, text: 'sai da sala...' });
    });

    await db.deleteMany({ lastStatus: { $lt: time } });

    return true;
}

export {
    create,
    find,
    findParticipantByName,
    remove,
};
