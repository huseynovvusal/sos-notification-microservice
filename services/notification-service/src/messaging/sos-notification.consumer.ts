import { sendEmail } from '@/helpers/email.helpers';
import logger from '@/lib/logger';
import { messaging, SOSMessage } from '@sos-notification-microservice/shared';
import { Channel } from 'amqplib';

function consumeSOSNotificationMessages(channel: Channel) {
  const exchangeName = messaging.SOS_EXCHANGE;
  const routingKey = messaging.SOSRoutingKeys.SOS_EMAIL;
  const queueName = messaging.SOSQueues.SOS_EMAIL_QUEUE;

  channel.assertExchange(exchangeName, 'direct', { durable: true });
  channel.assertQueue(queueName, { durable: true, autoDelete: false });
  channel.bindQueue(queueName, exchangeName, routingKey);

  channel.consume(queueName, async (message) => {
    if (!message || !message.content) {
      logger.warn('Received an empty message or message without content');
      return;
    }

    const sosMessage: SOSMessage = JSON.parse(message.content.toString());
    const { user, contact, message: sosText } = sosMessage;

    try {
      logger.debug(`Received SOS notification message: ${user.email}, (${user.name}) - ${sosText}`);

      await sendEmail(contact.email, 'SOS Notification', `SOS Alert by ${user.name} (${user.email}): ${sosText}`);

      channel.ack(message);
    } catch (error) {
      logger.error(`Failed to process SOS notification message: ${error}`);
      channel.nack(message, false, false);
    }
  });
}

export { consumeSOSNotificationMessages };
