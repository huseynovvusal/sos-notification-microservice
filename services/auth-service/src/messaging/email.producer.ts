import logger from '@/lib/logger';
import { messaging, type AuthEmailMessage } from '@sos-notification-microservice/shared';
import { Channel } from 'amqplib';

function produceAuthEmailMessage(channel: Channel, message: AuthEmailMessage) {
  try {
    const exchangeName = messaging.EMAIL_EXCHANGE;
    const routingKey = messaging.EmailRoutingKeys.AUTH_EMAIL;

    logger.debug(`Producing auth email message: ${message.receiverEmail}, (${message.receiverName})`);

    const messageBuffer = Buffer.from(JSON.stringify(message));

    channel.publish(exchangeName, routingKey, messageBuffer, {
      persistent: true,
      contentType: 'application/json'
    });
  } catch (error) {
    logger.error(`Failed to produce auth email message: ${error}`);
  }
}

export { produceAuthEmailMessage };
