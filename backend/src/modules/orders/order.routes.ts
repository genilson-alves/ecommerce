import { Router } from 'express';
import { create, getAll } from './order.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, create);
router.get('/', authenticateToken, getAll);

export default router;
