import { Router } from 'express';
import { create } from './order.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, create);

export default router;
