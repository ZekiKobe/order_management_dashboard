import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/auth';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(json());

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', env: env.nodeEnv } });
  });

  app.use('/auth', authRoutes);
  app.use('/orders', authMiddleware, orderRoutes);

  app.use(errorHandler);

  return app;
};

