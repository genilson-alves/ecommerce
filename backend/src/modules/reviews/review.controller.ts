import { Request, Response } from 'express';
import * as reviewService from './review.service';

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const review = await reviewService.createReview(userId, req.body);
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const review = await reviewService.updateReview(userId, id, req.body);
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getByProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await reviewService.getProductReviews(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
