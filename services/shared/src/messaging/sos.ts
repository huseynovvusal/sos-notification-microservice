export const SOS_EXCHANGE = 'email-notification';

export const SOSRoutingKeys = {
  SOS_EMAIL: 'sos-email',
  SOS_SMS: 'sos-sms',
  SOS_PUSH: 'sos-push'
} as const;

export const SOSQueues = {
  SOS_EMAIL_QUEUE: 'sos-email-queue',
  SOS_SMS_QUEUE: 'sos-sms-queue',
  SOS_PUSH_QUEUE: 'sos-push-queue'
} as const;
