import { Queue } from 'bullmq';
import redis from '../../config/redis';

export const emailQueue = new Queue('email-queue', {
  connection: redis,
});

export const addEmailJob = async (email: string, orderId: string) => {
  await emailQueue.add('send-thank-you', { email, orderId });
};
