import { logging } from '@sos-notification-microservice/shared';

const logger = logging.createLogger(
  {
    host: 'localhost',
    port: 5000
  },
  'info',
  'user-service'
);

export default logger;
