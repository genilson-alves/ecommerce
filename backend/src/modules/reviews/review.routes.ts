import { Router } from 'express';
import { create, getByProduct, update } from './review.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, create);
router.put('/:id', authenticateToken, update);
router.get('/product/:id', getByProduct);

export default router;
