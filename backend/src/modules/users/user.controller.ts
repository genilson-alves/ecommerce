import { Request, Response } from 'express';
import { registerUser, loginUser } from './user.service';
import { registerSchema, loginSchema } from './user.schema';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error.message === 'User already exists') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    
    res.cookie('ecommerce_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 * 24, // 24 hours
      sameSite: 'lax',
    });

    res.json({ user: result.user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error.message === 'Invalid email or password') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('ecommerce_token');
  res.json({ message: 'LOGOUT SUCCESSFUL' });
};
