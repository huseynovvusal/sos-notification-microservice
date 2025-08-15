export const EMAIL_EXCHANGE = 'email-notification';

export const EmailRoutingKeys = {
  AUTH_EMAIL: 'auth-email',
  PASSWORD_RESET: 'password-reset'
} as const;

export const EmailQueues = {
  AUTH_EMAIL_QUEUE: 'auth-email-queue',
  PASSWORD_RESET_QUEUE: 'password-reset-queue'
} as const;
