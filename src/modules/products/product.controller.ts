import { Request, Response } from 'express';
import * as productService from './product.service';
import { createProductSchema, productQuerySchema } from './product.schema';
import { ZodError } from 'zod';

export const create = async (req: Request, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = productQuerySchema.parse(req.query);
    const result = await productService.getProducts(query);
    res.json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
