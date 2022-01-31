import dayjs from 'dayjs';
import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
// eslint-disable-next-line import/no-cycle
import * as participantsService from './participantsService.js';

async function sendMessage({
    from,
    to,
    text,
    type,
}) {
    const db = await connection({ column: 'messages' });
    const time = dayjs().locale('pt-Br').format('HH:mm:ss');

    await db.insertOne({
        from,
        to,
        text,
        type,
        time,
    });
}

async function create({
    from,
    to,
    text,
    type,
}) {
    const searchParticipant = await participantsService.findParticipantByName({ name: from });

    if (!searchParticipant) {
        throw new BodyError('Invalid participant');
    }
    await sendMessage({
        from,
        to,
        text,
        type,
    });

    await closeConnection();

    return true;
}

async function find({ from, limit }) {
    const searchParticipant = await participantsService.findParticipantByName({ name: from });

    if (!searchParticipant) {
        throw new BodyError('Invalid participant');
    }

    const db = await connection({ column: 'messages' });

    const messages = await db.find({ $or: [{ to: 'Todos' }, { to: from }, { from }] }).sort({ time: -1 }).limit(limit).toArray();

    await closeConnection();

    return messages.reverse();
}

export {
    sendMessage,
    create,
    find,
};
