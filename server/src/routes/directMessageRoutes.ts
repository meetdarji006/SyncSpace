import { Router } from 'express';
import { getDirectMessages, sendDirectMessage } from '../controllers/directMessageController';

const router = Router();

router.get('/', getDirectMessages);
router.post('/', sendDirectMessage);

export default router;
