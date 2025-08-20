import { Channel } from 'amqplib';
import { messaging, SOSMessage } from '@sos-notification-microservice/shared';
import logger from '@/lib/logger';

function produceSOSNotificationMessage(channel: Channel, message: SOSMessage) {
  try {
    const exchangeName = messaging.SOS_EXCHANGE;
    const routingKey = messaging.SOSRoutingKeys.SOS_EMAIL;

    logger.debug(`Producing SOS notification message: ${message.user.email}, (${message.user.name})`);

    const messageBuffer = Buffer.from(JSON.stringify(message));

    channel.publish(exchangeName, routingKey, messageBuffer, {
      persistent: true,
      contentType: 'application/json'
    });
  } catch (error) {
    logger.error(`Failed to produce SOS notification message: ${error}`);
  }
}

export { produceSOSNotificationMessage };
