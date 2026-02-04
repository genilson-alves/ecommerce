import { Router, Request, Response } from 'express';
import { authenticateToken } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';

const router = Router();

// Stub controller
const createProduct = (req: Request, res: Response) => {
  res.status(201).json({ message: 'Product created successfully' });
};

router.post(
  '/',
  authenticateToken,
  requireRole('ADMIN'),
  createProduct
);

export default router;
