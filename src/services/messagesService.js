import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { closeConnection, connection } from '../database.js';
import BodyError from '../errors/BodyError.js';
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
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

async function deleteById({ name, id }) {
    const db = await connection({ column: 'messages' });

    const message = await db.findOne({ _id: new ObjectId(id) });

    if (!message) {
        throw new NotFoundError('This message does not exist');
    }

    if (message.from !== name) {
        throw new UnauthorizedError('The participant does not own this message');
    }

    await db.deleteOne({ _id: new ObjectId(id) });

    await closeConnection();
}

export {
    sendMessage,
    create,
    find,
    deleteById,
};
