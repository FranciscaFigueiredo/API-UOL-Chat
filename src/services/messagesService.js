import dayjs from 'dayjs';
import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import * as participantsService from './participantsService.js';

async function create({
    from,
    to,
    text,
    type,
}) {
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

    return true;
}

async function find({ from }) {
    const db = await connection({ column: 'messages' });

    const messages = await db.find({ $or: [{ to: 'Todos' }, { to: from }, { from }] }).toArray();

    await closeConnection();

    return messages;
}

export {
    create,
    find,
};
