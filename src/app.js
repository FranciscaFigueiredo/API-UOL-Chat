import express from 'express';
import cors from 'cors';
import participantsRouter from './routers/participantsRouter.js';
import messagesRouter from './routers/messagesRouter.js';
import statusRouter from './routers/statusRouter.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/participants', participantsRouter);
app.use('/messages', messagesRouter);
app.use('/status', statusRouter);

export {
    app,
};
