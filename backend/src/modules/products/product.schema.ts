import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative("Price cannot be negative"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().optional(),
});

export const productQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  featured: z.string().optional().transform((val) => (val === 'true')),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'oldest']).optional().default('newest'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
