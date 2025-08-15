import * as grpc from '@grpc/grpc-js';
import mongoose from 'mongoose';

import logger from '@/lib/logger';
import { config } from '@/config';

const grpcServer = new grpc.Server();

function setupGrpcServer(): grpc.Server {
  const grpcHost = config.GRPC_HOST;
  const grpcPort = config.GRPC_PORT;

  const grpcAddress = `${grpcHost}:${grpcPort}`;

  grpcServer.bindAsync(grpcAddress, grpc.ServerCredentials.createInsecure(), (err, _port) => {
    if (err) {
      logger.error(`Failed to bind gRPC server: ${err.message}`);
      throw err;
    }

    logger.info(`gRPC server is running on ${grpcAddress}`);
  });

  return grpcServer;
}

async function initialize() {
  setupGrpcServer();
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down auth service...');

  await mongoose.connection.close();

  grpcServer?.forceShutdown();

  logger.info('Notification service has been shut down gracefully.');

  process.exit(0);
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
