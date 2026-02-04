import prisma from '../../config/db';
import { CreateProductInput, ProductQueryInput } from './product.schema';
import { Prisma } from '@prisma/client';

export const createProduct = async (data: CreateProductInput) => {
  return await prisma.product.create({
    data,
  });
};

export const getProducts = async (query: ProductQueryInput) => {
  const { page = 1, limit = 10, name, minPrice, maxPrice } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
