import { config } from '@/config';
import { UserServiceClient } from '@/generated/user_service';
import { credentials } from '@grpc/grpc-js';

export const userServiceClient = new UserServiceClient(config.USER_SERVICE_GRPC_ADDRESS!, credentials.createInsecure());
