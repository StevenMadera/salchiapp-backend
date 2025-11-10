import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import menuItemRoutes from './routes/menuItem';
import ordersRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import externalRoutes from './routes/external';

const paymentsRoutes = require('./routes/payments');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:8100', // Ionic serve
    'capacitor://localhost', // App móvil (Capacitor)
    'http://localhost',      // Emulador
    'https://salchiapp-backend.onrender.com' // (opcional, si tu frontend está en Render)
    // Agrega aquí el dominio de tu app móvil si la publicas en web
  ],
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/external', externalRoutes);

import { Request, Response } from 'express';

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

export default app;