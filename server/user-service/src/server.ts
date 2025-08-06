import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'http';

import { config } from '@/config';
import { connectDatabase } from '@/db/connection';
import logger from '@/lib/logger';
import router from '@/routes';
import { errorHandler } from '@/middlewares/error-handler.middleware';

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
app.use('/api/users', router);

// Error handler
app.use(errorHandler);

async function initialize() {
  await connectDatabase(`${config.MONGO_URI}`);

  server = app.listen(PORT, () => {
    logger.info(`User service is running on PORT:${PORT}`);
  });
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down user service...');

  await mongoose.connection.close();

  server?.close(() => {
    logger.warn('User service has shut down gracefully.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  shutdown();
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  shutdown();
});
