import mongoose from 'mongoose';
import * as grpc from '@grpc/grpc-js';

import { config } from '@/config';
import { connectDatabase } from '@/db/connection';
import logger from '@/lib/logger';
import { userServiceGrpc } from '@sos-notification-microservice/shared';
import { userServiceImplementation } from '@/grpc/user-service-impl';

const grpcServer = new grpc.Server();

function setupGrpcServer(): grpc.Server {
  grpcServer.addService(userServiceGrpc.UserServiceService, userServiceImplementation);

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
  // await new Promise<void>((resolve, reject) => {
  //   eurekaClient.start((error) => {
  //     if (error) {
  //       logger.error('Eureka registration failed:', error);
  //       return reject(error);
  //     }
  //     logger.info('Eureka registration successful');
  //     resolve();
  //   });
  // });

  await connectDatabase(`${config.MONGO_URI}`);

  setupGrpcServer();
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down user service...');

  await mongoose.connection.close();

  await new Promise<void>((resolve) => {
    grpcServer.tryShutdown(() => {
      logger.info('gRPC server shut down gracefully');
      resolve();
    });
  });

  logger.info('User service has been shut down gracefully.');

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.log(error);
  shutdown();
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  shutdown();
});
