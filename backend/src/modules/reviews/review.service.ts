import prisma from '../../config/db';

export const createReview = async (userId: string, data: { productId: string, orderId: string, rating: number, comment?: string }) => {
  // 1. Validate the order exists, belongs to the user, and is DELIVERED
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: { items: true }
  });

  if (!order || order.userId !== userId) {
    throw new Error('Order not found or unauthorized');
  }

  if (order.status !== 'DELIVERED') {
    throw new Error('You can only review products from delivered orders');
  }

  // 2. Validate the product was actually in this order
  const itemInOrder = order.items.find(item => item.productId === data.productId);
  if (!itemInOrder) {
    throw new Error('This product was not found in the specified order');
  }

  // 3. Ensure user hasn't already reviewed this specific order item
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_orderId_productId: {
        userId,
        orderId: data.orderId,
        productId: data.productId
      }
    }
  });

  if (existingReview) {
    throw new Error('You have already reviewed this purchase');
  }

  // 4. Create the review
  return await prisma.review.create({
    data: {
      userId,
      productId: data.productId,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: { select: { email: true } }
    }
  });
};

export const updateReview = async (userId: string, id: string, data: { rating: number, comment?: string }) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== userId) throw new Error('Review not found or unauthorized');

  return await prisma.review.update({
    where: { id },
    data: {
      rating: data.rating,
      comment: data.comment,
    }
  });
};

export const getProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true
  });

  return {
    reviews,
    averageRating: aggregate._avg.rating || 0,
    totalReviews: aggregate._count
  };
};
