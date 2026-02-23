import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/users/user.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import paymentRoutes from './modules/payments/payment.routes';
import { webhook } from './modules/payments/payment.controller';

const app = express();

app.use(helmet());
app.use(cookieParser());

// Webhook route must be before express.json() to consume raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes); // Includes create-intent

// Health check
app.get('/', (req, res) => {
  res.send('Ecommerce API is running');
});

export default app;
