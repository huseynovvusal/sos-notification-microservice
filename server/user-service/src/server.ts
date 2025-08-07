import express from 'express';
import mongoose from 'mongoose';
// import { Server } from 'http';
import * as grpc from '@grpc/grpc-js';

import { config } from '@/config';
import { connectDatabase } from '@/db/connection';
import logger from '@/lib/logger';
import router from '@/routes';
import { errorHandler } from '@/middlewares/error-handler.middleware';
import { UserServiceService } from './generated/user_service';
import { userServiceImplementation } from './grpc/user-service-impl';

// let server: Server;
// const PORT = process.env.PORT || 3000;

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

const grpcServer = new grpc.Server();

function setupGrpcServer(): grpc.Server {
  grpcServer.addService(UserServiceService, userServiceImplementation);

  const grpcHost = config.GRPC_HOST;
  const grpcPort = config.GRPC_PORT;

  if (!grpcHost || !grpcPort) {
    throw new Error('GRPC_HOST and GRPC_PORT must be defined in the environment variables');
  }

  const grpcAddress = `${grpcHost}:${grpcPort}`;

  grpcServer.bindAsync(grpcAddress, grpc.ServerCredentials.createInsecure(), (err, _port) => {
    if (err) {
      logger.error(`Failed to bind gRPC server: ${err.message}`);
      throw err;
    }

    grpcServer.start();
    logger.info(`gRPC server is running on ${grpcAddress}`);
  });

  return grpcServer;
}

async function initialize() {
  await connectDatabase(`${config.MONGO_URI}`);

  setupGrpcServer();

  // server = app.listen(PORT, () => {
  //   logger.info(`User service is running on PORT:${PORT}`);
  // });
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down user service...');

  await mongoose.connection.close();

  grpcServer.forceShutdown();

  // server?.close(() => {
  //   logger.warn('User service has shut down gracefully.');
  //   process.exit(0);
  // });
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
