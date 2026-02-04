import { Router } from 'express';
import { create, getAll } from './product.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';

const router = Router();

router.get('/', getAll);

router.post(
  '/',
  authenticateToken,
  requireRole('ADMIN'),
  create
);

export default router;