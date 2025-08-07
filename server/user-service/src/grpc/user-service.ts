import * as grpc from '@grpc/grpc-js';
import { CreateUserRequest, CreateUserResponse } from '@/generated/user_service';

import logger from '@/lib/logger';
import User from '@/models/user.model';

export const userServiceImplementation: grpc.UntypedServiceImplementation = {
  createUser: async (
    call: grpc.ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
    callback: grpc.sendUnaryData<CreateUserResponse>
  ) => {
    try {
      const request = call.request;

      const user = new User({
        name: request.name,
        email: request.email,
        phone: request.phone
      });

      const createdUser = await user.save();

      const response: CreateUserResponse = {
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          contacts: [],
          createdAt: createdUser.createdAt.toString(),
          updatedAt: createdUser.updatedAt.toString()
        }
      };

      callback(null, response);
    } catch (error) {
      logger.error('Error creating user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }
};
