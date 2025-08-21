import * as grpc from '@grpc/grpc-js';

import logger from '@/lib/logger';
import { config } from '@/config';
import { connectRabbitMQ, rabbitMQChannel, rabbitMQConnection } from './messaging/connection';
import { sosServiceGrpc } from '@sos-notification-microservice/shared';
import { sosServiceImplementation } from './grpc/sos-service-impl';

const grpcServer = new grpc.Server();

function setupGrpcServer(): grpc.Server {
  grpcServer.addService(sosServiceGrpc.SOSServiceService, sosServiceImplementation);

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

  setupGrpcServer();
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down SOS service...');

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

  logger.info('SOS service has been shut down gracefully.');

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
