import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const intent = await paymentService.createPaymentIntent(orderId, userId);
    res.json({ clientSecret: intent.client_secret });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const webhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    await paymentService.handleStripeWebhook(signature, req.body);
    res.json({ received: true });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
