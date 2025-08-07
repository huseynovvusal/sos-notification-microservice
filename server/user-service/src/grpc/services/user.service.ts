import * as grpc from '@grpc/grpc-js';
import {
  AddContactRequest,
  CreateUserRequest,
  CreateUserResponse,
  GetUserByIdRequest,
  GetUserResponse,
  UserResponse
} from '@/generated/user_service';
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

  public async getUserById(call: grpc.ServerUnaryCall<GetUserByIdRequest, GetUserResponse>, callback: grpc.sendUnaryData<GetUserResponse>) {
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

  public async addContactToUser(call: grpc.ServerUnaryCall<AddContactRequest, UserResponse>, callback: grpc.sendUnaryData<UserResponse>) {
    try {
      const request = call.request;

      if (!request.contactEmail) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Contact email is required'
        });
      }

      logger.debug(`Adding contact with email ${request.contactEmail} to user with ID ${request.userId}`);

      const contact = await User.findOne({ email: request.contactEmail });

      if (!contact) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Contact not found'
        });
      }

      if (contact.id === request.userId) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Cannot add yourself as a contact'
        });
      }

      const updatedUser = await User.findByIdAndUpdate(request.userId, { $addToSet: { contacts: contact.id } }, { new: true }).populate(
        'contacts'
      );

      if (!updatedUser) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      }

      const response = await this.mapUserToResponse(updatedUser);

      callback(null, response);
    } catch (error) {
      logger.error('Error adding contact to user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  public async removeContactFromUser(
    call: grpc.ServerUnaryCall<AddContactRequest, UserResponse>,
    callback: grpc.sendUnaryData<UserResponse>
  ) {
    try {
      const request = call.request;

      if (!request.contactEmail) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Contact email is required'
        });
      }

      logger.debug(`Removing contact with email ${request.contactEmail} from user with ID ${request.userId}`);

      const contact = await User.findOne({ email: request.contactEmail });

      if (!contact) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Contact not found'
        });
      }

      const updatedUser = await User.findByIdAndUpdate(request.userId, { $pull: { contacts: contact.id } }, { new: true }).populate(
        'contacts'
      );

      if (!updatedUser) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      }

      const response = await this.mapUserToResponse(updatedUser);

      callback(null, response);
    } catch (error) {
      logger.error('Error removing contact from user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  private async mapUserToResponse(user: IUserDocument): Promise<UserResponse> {
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
