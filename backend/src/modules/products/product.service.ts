import prisma from '../../config/db';
import { CreateProductInput, ProductQueryInput } from './product.schema';
import { Prisma } from '@prisma/client';
import { getCache, setCache } from '../../common/services/cache.service';

export const createProduct = async (data: CreateProductInput) => {
  return await prisma.product.create({
    data,
  });
};

export const updateProduct = async (id: string, data: any) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

export const getProducts = async (query: ProductQueryInput) => {
  const cacheKey = `products:${JSON.stringify(query)}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const { page = 1, limit = 10, name, category, minPrice, maxPrice, sortBy, featured } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (category) {
    where.category = {
      equals: category,
      mode: 'insensitive',
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

  if (featured) {
    orderBy = { salesCount: 'desc' };
  } else {
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
