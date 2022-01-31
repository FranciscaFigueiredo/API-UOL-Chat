import { Router } from 'express';
import * as messagesController from '../controllers/messagesController.js';

const router = new Router();

router.post('/', messagesController.postMessage);
router.get('/', messagesController.getMessages);

export default router;
