import { Request, Response } from 'express';
import * as orderService from './order.service';
import { createOrderSchema } from './order.schema';
import { ZodError } from 'zod';

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(userId, data);
    
    res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await orderService.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
