import * as grpc from '@grpc/grpc-js';
import { CreateUserRequest, CreateUserResponse, GetUserByIdRequest, GetUserResponse } from '@/generated/user_service';
import User, { IUserDocument } from '@/models/user.model';
import logger from '@/lib/logger';

export class UserService {
  public async createUser(
    call: grpc.ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
    callback: grpc.sendUnaryData<CreateUserResponse>
  ) {
    try {
      const request = call.request;

      const existingUser = await User.findOne({ $or: [{ email: request.email }, { phone: request.phone }] });

      if (existingUser) {
        return callback({
          code: grpc.status.ALREADY_EXISTS,
          message: 'User with those credentials already exists'
        });
      }

      const user = new User({
        name: request.name,
        email: request.email,
        phone: request.phone
      });

      const createdUser = await user.save();

      const response = await this.mapUserToResponse(createdUser);

      callback(null, response);
    } catch (error) {
      logger.error('Error creating user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  public async getUserById(
    call: grpc.ServerUnaryCall<GetUserByIdRequest, CreateUserResponse>,
    callback: grpc.sendUnaryData<CreateUserResponse>
  ) {
    try {
      const request = call.request;

      const user = await User.findById(request.id).populate('contacts');

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      }

      const response: CreateUserResponse = await this.mapUserToResponse(user);

      callback(null, response);
    } catch (error) {
      logger.error('Error getting user by ID:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  private async mapUserToResponse(user: IUserDocument): Promise<GetUserResponse> {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        contacts: user.contacts,
        createdAt: user.createdAt.toString(),
        updatedAt: user.updatedAt.toString()
      }
    };
  }
}

export const userService = new UserService();
