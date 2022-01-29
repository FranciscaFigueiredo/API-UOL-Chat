import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';

const router = new Router();

router.post('/', participantsController.postParticipants);
router.get('/', participantsController.getParticipants);

export default router;
