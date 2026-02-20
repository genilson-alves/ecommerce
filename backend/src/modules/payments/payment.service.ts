import Stripe from "stripe";
import prisma from "../../config/db";
import { addEmailJob } from "../../common/services/queue.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia" as any,
});

export const createPaymentIntent = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Unauthorized");
  if (order.status !== "PENDING") throw new Error("Order is not pending");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.totalAmount) * 100), // Stripe uses cents
    currency: "usd",
    metadata: {
      orderId: order.id,
      userEmail: order.user.email,
    },
  });

  return paymentIntent;
};

export const handleStripeWebhook = async (signature: string, payload: Buffer) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    const userEmail = paymentIntent.metadata.userEmail;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });

      if (userEmail) {
        await addEmailJob(userEmail, orderId);
      }
    }
  }

  return { received: true };
};
