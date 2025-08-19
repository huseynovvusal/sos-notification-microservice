import * as grpc from '@grpc/grpc-js';
import mongoose from 'mongoose';

import logger from '@/lib/logger';
import { connectDatabase } from '@/db/connection';
import { config } from '@/config';
import { authServiceGrpc } from '@sos-notification-microservice/shared';
import { authServiceImplementation } from '@/grpc/auth-service-impl';
import { connectRabbitMQ, rabbitMQChannel, rabbitMQConnection } from './messaging/connection';

const grpcServer = new grpc.Server();

function setupGrpcServer(): grpc.Server {
  grpcServer.addService(authServiceGrpc.AuthServiceService, authServiceImplementation);

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

    logger.info(`gRPC server is running on ${grpcAddress}`);
  });

  return grpcServer;
}

async function initialize() {
  await connectRabbitMQ();

  await connectDatabase(config.MONGO_URI!);

  setupGrpcServer();
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down auth service...');

  await mongoose.disconnect();

  await new Promise<void>((resolve) => {
    grpcServer.tryShutdown(() => {
      logger.info('gRPC server shut down gracefully');
      resolve();
    });
  });

  if (rabbitMQChannel) {
    try {
      await rabbitMQChannel.close();
      logger.info('RabbitMQ channel closed successfully.');
    } catch (error) {
      logger.error(`Error closing RabbitMQ channel: ${error}`);
    }
  }
  if (rabbitMQConnection) {
    try {
      await rabbitMQConnection.close();
      logger.info('RabbitMQ connection closed successfully.');
    } catch (error) {
      logger.error(`Error closing RabbitMQ connection: ${error}`);
    }
  }

  logger.info('Auth service has been shut down gracefully.');

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
