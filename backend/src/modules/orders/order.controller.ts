import { Request, Response } from 'express';
import * as orderService from './order.service';
import { createOrderSchema } from './order.schema';
import { ZodError } from 'zod';

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(userId, data);
    res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ message: error.message });
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

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';
    const orders = await orderService.getAllOrders(activeOnly);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const cancel = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const result = await orderService.cancelOrder(id, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await orderService.getAdminAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
