import * as grpc from '@grpc/grpc-js';
import mongoose from 'mongoose';

import logger from '@/lib/logger';
import { config } from '@/config';
import { Channel, ChannelModel } from 'amqplib';
import { connectToRabbitMQ } from './messaging/connection';
import { consumeAuthEmailMessages } from './messaging/email.consumer';

const grpcServer = new grpc.Server();

let rabbitMQConnection: ChannelModel;
let rabbitMQChannel: Channel;

function setupGrpcServer(): void {
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
}

async function setupRabbitMQ(): Promise<void> {
  const { channel, connection } = await connectToRabbitMQ();

  rabbitMQConnection = connection;
  rabbitMQChannel = channel;
}

async function initialize() {
  await setupRabbitMQ();
  consumeAuthEmailMessages(rabbitMQChannel);

  setupGrpcServer();
}

initialize();

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down auth service...');

  await mongoose.connection.close();

  grpcServer?.forceShutdown();

  await rabbitMQChannel?.close();
  await rabbitMQConnection?.close();

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
