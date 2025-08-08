import * as grpc from '@grpc/grpc-js';
import {
  AddContactRequest,
  AddContactResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUserByIdRequest,
  GetUserResponse,
  RemoveContactRequest,
  RemoveContactResponse,
  UserMessage
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

      const user = await User.create({
        name: request.name,
        email: request.email,
        phone: request.phone
      });

      const mappedUser = this.mapUserToResponse(user);

      callback(null, {
        user: mappedUser
      });
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

      const user = await User.findById(request.userId).populate('contacts');

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      }

      const mappedUser = this.mapUserToResponse(user);

      callback(null, {
        user: mappedUser
      });
    } catch (error) {
      logger.error('Error getting user by ID:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  public async addContactToUser(
    call: grpc.ServerUnaryCall<AddContactRequest, AddContactResponse>,
    callback: grpc.sendUnaryData<AddContactResponse>
  ) {
    try {
      const request = call.request;

      if (!request.contactEmail) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Contact email is required'
        });
      }

      logger.info(`Adding contact with email ${request.contactEmail} to user with ID ${request.userId}`);

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

      const mappedUser = this.mapUserToResponse(updatedUser);

      callback(null, {
        user: mappedUser
      });
    } catch (error) {
      logger.error('Error adding contact to user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  public async removeContactFromUser(
    call: grpc.ServerUnaryCall<RemoveContactRequest, RemoveContactResponse>,
    callback: grpc.sendUnaryData<RemoveContactResponse>
  ) {
    try {
      const request = call.request;

      if (!request.contactEmail) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Contact email is required'
        });
      }

      logger.info(`Removing contact with email ${request.contactEmail} from user with ID ${request.userId}`);

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

      const mappedUser = this.mapUserToResponse(updatedUser);

      callback(null, {
        user: mappedUser
      });
    } catch (error) {
      logger.error('Error removing contact from user:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  private mapUserToResponse(user: IUserDocument): UserMessage {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      contacts: user.contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export const userService = new UserService();
