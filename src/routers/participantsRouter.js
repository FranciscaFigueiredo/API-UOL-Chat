import { Router } from 'express';
import * as participantsController from '../controllers/participantsController';

const router = new Router();

router.post('/', participantsController.postParticipants);

export default router;
