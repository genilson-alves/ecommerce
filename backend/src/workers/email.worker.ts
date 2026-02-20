import { Worker } from 'bullmq';
import redis from '../config/redis';

const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`Sending email to ${job.data.email} for Order ${job.data.orderId}`);
    // Simulate email sending (integrate nodemailer here if SMTP credentials are provided)
    // await transporter.sendMail(...)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Email sent to ${job.data.email}`);
  },
  { connection: redis }
);

export default worker;
