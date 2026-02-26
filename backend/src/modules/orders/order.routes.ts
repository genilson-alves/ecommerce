import { Router } from 'express';
import { create, getAll, getAdminOrders, updateStatus, cancel, getAnalytics } from './order.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';
import { requireRole } from '../../common/middlewares/role.middleware';

const router = Router();

// User Routes
router.post('/', authenticateToken, create);
router.get('/', authenticateToken, getAll);
router.post('/:id/cancel', authenticateToken, cancel);

// Admin Routes
router.get('/admin/list', authenticateToken, requireRole('ADMIN'), getAdminOrders);
router.get('/admin/analytics', authenticateToken, requireRole('ADMIN'), getAnalytics);
router.patch('/:id/status', authenticateToken, requireRole('ADMIN'), updateStatus);

export default router;
