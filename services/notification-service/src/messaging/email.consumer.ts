import { sendEmail } from '@/helpers/email.helpers';
import logger from '@/lib/logger';
import { messaging } from '@sos-notification-microservice/shared';
import type { AuthEmailMessage } from '@sos-notification-microservice/shared';
import { Channel, ConsumeMessage } from 'amqplib';

async function consumeAuthEmailMessages(channel: Channel) {
  try {
    const exchangeName = messaging.EMAIL_EXCHANGE;
    const routingKey = messaging.EmailRoutingKeys.AUTH_EMAIL;
    const queueName = messaging.EmailQueues.AUTH_EMAIL_QUEUE;

    channel.assertExchange(exchangeName, 'direct', { durable: true });
    channel.assertQueue(queueName, { durable: true, autoDelete: false });
    channel.bindQueue(queueName, exchangeName, routingKey);

    channel.consume(queueName, async (message: ConsumeMessage | null) => {
      if (!message || !message.content) {
        logger.warn('Received an empty message or message without content');
        return;
      }

      const { receiverEmail, receiverName } = JSON.parse(message.content.toString()) as AuthEmailMessage;

      try {
        await sendEmail(receiverEmail, 'Welcome to SOS Notification', `Hello ${receiverName}, welcome to our service!`);

        logger.debug(`Received auth email message: ${receiverEmail}, (${receiverName})`);

        channel.ack(message);
      } catch (error) {
        logger.error(`Failed to send email to ${receiverEmail}: ${error}`);
        channel.nack(message, false, false); // Do not requeue the message
        return;
      }
    });
  } catch (error) {
    logger.error(`Failed to consume auth email messages: ${error}`);
    throw error;
  }
}

export { consumeAuthEmailMessages };
