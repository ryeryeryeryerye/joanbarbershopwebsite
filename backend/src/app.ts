import express, { Application } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Global Middlewares
  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/v1', apiRouter);

  // Central Error Handler
  app.use(errorHandler);

  return app;
};

