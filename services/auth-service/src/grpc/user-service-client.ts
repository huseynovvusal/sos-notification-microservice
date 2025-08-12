import { credentials } from '@grpc/grpc-js';
import { config } from '@/config';
import { helpers } from '@sos-notification-microservice/shared';

export const userServiceClient = helpers.createUserServiceClient(config.USER_SERVICE_GRPC_ADDRESS!, credentials.createInsecure());
