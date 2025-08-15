import { config } from '@/config';
import logger from '@/lib/logger';
import client from 'amqplib';

async function connectToRabbitMQ() {
  try {
    const connection = await client.connect(config.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    logger.info('Connected to RabbitMQ successfully');

    return { connection, channel };
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export { connectToRabbitMQ };
