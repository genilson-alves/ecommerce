import { Router } from 'express';
import express from 'express';
import { createIntent, webhook } from './payment.controller';
import { authenticateToken } from '../../common/middlewares/auth.middleware';

const router = Router();

router.post('/create-intent', authenticateToken, createIntent);

// Webhook must handle raw body, handled in app.ts or specifically here if we split routers carefully.
// To keep it simple in this architecture, we will use a specific route handler in app.ts or 
// ensure body parser is configured correctly. For now, we route it here.
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router;
