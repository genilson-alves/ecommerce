import prisma from '../../config/db';
import { CreateOrderInput } from './order.schema';

export const createOrder = async (userId: string, data: CreateOrderInput) => {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of data.items) {
      // 1. Check stock and get price (using 'update' with a 'where' check for atomic stock decrement)
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // 2. Subtract stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
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

    // 3. Create Order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
};
