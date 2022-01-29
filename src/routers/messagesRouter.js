import { Router } from 'express';
import * as messagesController from '../controllers/messagesController.js';

const router = new Router();

router.post('/', messagesController.postMessage);
// router.get('/', participantsController.getParticipants);

export default router;
