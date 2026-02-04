import prisma from '../../config/db';
import { CreateProductInput, ProductQueryInput } from './product.schema';
import { Prisma } from '@prisma/client';
import { getCache, setCache } from '../../common/services/cache.service';

export const createProduct = async (data: CreateProductInput) => {
  return await prisma.product.create({
    data,
  });
};

export const getProducts = async (query: ProductQueryInput) => {
  const cacheKey = `products:${JSON.stringify(query)}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

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

  const result = {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 30); // Cache for 30 seconds

  return result;
};
