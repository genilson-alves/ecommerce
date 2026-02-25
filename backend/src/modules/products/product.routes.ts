import { Router } from 'express';
import { create, getAll, getOne, update, remove } from './product.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);

router.post(
  '/',
  authenticateToken,
  requireRole('ADMIN'),
  create
);

router.put(
  '/:id',
  authenticateToken,
  requireRole('ADMIN'),
  update
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole('ADMIN'),
  remove
);

export default router;