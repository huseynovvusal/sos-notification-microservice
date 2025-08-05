import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'http';

import logger from '@/lib/logger';
import router from '@/routes';
import { errorHandler } from '@/middlewares/error-handler.middleware';
import { connectDatabase } from './db/connection';
import { config } from './config';

let server: Server;
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/api/auth', router);

// Error handler
app.use(errorHandler);

async function initialize() {
  await connectDatabase(config.MONGO_URI!);

  server = app.listen(PORT, () => {
    logger.info(`Auth service is running on PORT:${PORT}`);
  });
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down auth service...');

  await mongoose.connection.close();

  server?.close(() => {
    logger.warn('Auth service has shut down gracefully.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
