import { closeConnection, connection } from '../database.js';

async function findMessages({ from }) {
    const db = await connection({ column: 'messages' });

    const messages = await db.find({ $or: [{ to: 'Todos' }, { to: from }, { from }] }).toArray();

    await closeConnection();

    return messages;
}

export {
    findMessages,
};
