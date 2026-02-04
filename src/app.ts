import express from 'express';
import helmet from 'helmet';
import userRoutes from './modules/users/user.routes';
import productRoutes from './modules/products/product.routes';

const app = express();

app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Ecommerce API is running');
});

export default app;
