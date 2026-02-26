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
        status: 'PAID',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  });

  return order;
};

export const updateOrderStatus = async (orderId: string, status: any) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) throw new Error('Order not found');
  if (order.userId !== userId) throw new Error('Unauthorized');
  if (order.status !== 'PAID' && order.status !== 'PENDING') {
    throw new Error('Order cannot be cancelled at this stage');
  }

  // Return stock
  const items = await prisma.orderItem.findMany({
    where: { orderId }
  });

  await prisma.$transaction([
    ...items.map(item => prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    })),
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    })
  ]);

  return { message: 'Order cancelled successfully' };
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

export const getAllOrders = async (activeOnly: boolean = false) => {
  const where = activeOnly ? { status: { not: 'DELIVERED' as any } } : {};
  return await prisma.order.findMany({
    where,
    include: {
      user: { select: { email: true } },
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAdminAnalytics = async () => {
  const [revenueResult, productCount, totalUsers, usersWithOrders, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true }
    }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.groupBy({
      by: ['userId'],
    }).then(groups => groups.length),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    })
  ]);

  const conversionRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;

  return {
    totalRevenue: Number(revenueResult._sum.totalAmount || 0),
    inventoryCount: productCount,
    conversionRate: conversionRate.toFixed(2) + '%',
    recentActivity: recentOrders.map(o => ({
      id: o.id,
      user: o.user.email,
      amount: o.totalAmount,
      time: o.createdAt,
      status: o.status
    }))
  };
};
