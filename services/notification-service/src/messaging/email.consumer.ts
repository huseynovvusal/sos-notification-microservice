import logger from '@/lib/logger';
import { messaging } from '@sos-notification-microservice/shared';
import { Channel, ConsumeMessage } from 'amqplib';

async function consumeAuthEmailMessages(channel: Channel) {
  try {
    const exchangeName = messaging.EMAIL_EXCHANGE;
    const routingKey = messaging.EmailRoutingKeys.AUTH_EMAIL;
    const queueName = messaging.EmailQueues.AUTH_EMAIL_QUEUE;

    await channel.assertExchange(exchangeName, 'direct');

    const { queue } = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(queueName, exchangeName, routingKey);

    channel.consume(queue, async (message: ConsumeMessage | null) => {
      const content = message?.content.toString();

      logger.debug(`Received auth email message: ${content}`);

      channel.ack(message!);
    });
  } catch (error) {
    logger.error(`Failed to consume auth email messages: ${error}`);
    throw error;
  }
}

export { consumeAuthEmailMessages };
