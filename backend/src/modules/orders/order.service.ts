import prisma from '../../config/db';
import { CreateOrderInput } from './order.schema';

export const createOrder = async (userId: string, data: CreateOrderInput) => {
  const order = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
          salesCount: {
            increment: item.quantity,
          },
        },
      });

      const priceAtPurchase = Number(product.price);
      totalAmount += priceAtPurchase * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
      });
    }

    return await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PAID', // Start as PAID for mock checkout
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  });

  // --- Mock Lifecycle Transitions ---
  // In a real app, this would be handled by a worker (BullMQ) or Stripe Webhooks.
  
  // 30 Seconds -> PREPARING
  setTimeout(async () => {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PREPARING' },
    }).catch(console.error);
  }, 30000);

  // 2 Minutes -> SHIPPED
  setTimeout(async () => {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'SHIPPED' },
    }).catch(console.error);
  }, 120000);

  // 5 Minutes -> DELIVERED
  setTimeout(async () => {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    }).catch(console.error);
  }, 300000);

  return order;
};

export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};
