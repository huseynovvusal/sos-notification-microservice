import { config } from '@/config';
import logger from '@/lib/logger';
import client, { Channel, ChannelModel } from 'amqplib';

let rabbitMQConnection: ChannelModel;
let rabbitMQChannel: Channel;

async function connectRabbitMQ() {
  try {
    const connection = await client.connect(config.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    rabbitMQConnection = connection;
    rabbitMQChannel = channel;

    logger.info('Connected to RabbitMQ successfully');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export { connectRabbitMQ, rabbitMQConnection, rabbitMQChannel };
