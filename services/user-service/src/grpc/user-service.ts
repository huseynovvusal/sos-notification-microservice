import * as grpc from '@grpc/grpc-js';
import { userServiceGrpc } from '@sos-notification-microservice/shared';
import logger from '@/lib/logger';
import { User } from '@/generated/prisma';
import { userRepository, UserRepository } from '@/repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(
    call: grpc.ServerUnaryCall<userServiceGrpc.CreateUserRequest, userServiceGrpc.CreateUserResponse>,
    callback: grpc.sendUnaryData<userServiceGrpc.CreateUserResponse>
  ) {
    try {
      const { email, name, phone } = call.request;

      const existingUser = await this.userRepository.userExistsWithEmailOrPassword(email, phone);

      if (existingUser) {
        return callback({
          code: grpc.status.ALREADY_EXISTS,
          message: 'User with those credentials already exists'
        });
      }

      const user = await this.userRepository.createUser({
        name,
        email,
        phone
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

  public async getUserById(
    call: grpc.ServerUnaryCall<userServiceGrpc.GetUserByIdRequest, userServiceGrpc.GetUserResponse>,
    callback: grpc.sendUnaryData<userServiceGrpc.GetUserResponse>
  ) {
    try {
      const request = call.request;

      const user = await this.userRepository.getUserById(request.userId);

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

  public async getUserContacts(
    call: grpc.ServerUnaryCall<userServiceGrpc.GetUserContactsRequest, userServiceGrpc.GetUserContactsResponse>,
    callback: grpc.sendUnaryData<userServiceGrpc.GetUserContactsResponse>
  ) {
    try {
      const { userId } = call.request;
      const contacts = await this.userRepository.getUserContacts(userId);

      if (!contacts) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'No contacts found for the user'
        });
      }

      const mappedContacts = contacts.map((contact) => ({
        id: contact.contact.id,
        name: contact.contact.name,
        email: contact.contact.email,
        phone: contact.contact.phone
      }));

      callback(null, {
        contacts: mappedContacts
      });
    } catch (error) {
      logger.error('Error getting user contacts:', error);

      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  public async addContactToUser(
    call: grpc.ServerUnaryCall<userServiceGrpc.AddContactRequest, userServiceGrpc.AddContactResponse>,
    callback: grpc.sendUnaryData<userServiceGrpc.AddContactResponse>
  ) {
    try {
      const { userId, contactEmail } = call.request;

      if (!contactEmail) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Contact email is required'
        });
      }

      logger.info(`Adding contact with email ${contactEmail} to user with ID ${userId}`);

      const contact = await this.userRepository.getUserByEmail(contactEmail);

      if (!contact) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Contact not found'
        });
      }

      if (contact.id === userId) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Cannot add yourself as a contact'
        });
      }

      const updatedUser = await this.userRepository.addTrustedContactToUserById(userId, contact.id);

      logger.debug(`Updated user with new contact:\n${JSON.stringify(updatedUser, null, 2)}`);

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
    call: grpc.ServerUnaryCall<userServiceGrpc.RemoveContactRequest, userServiceGrpc.RemoveContactResponse>,
    callback: grpc.sendUnaryData<userServiceGrpc.RemoveContactResponse>
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

      const contact = await this.userRepository.getUserByEmail(request.contactEmail);

      if (!contact) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Contact not found'
        });
      }

      const updatedUser = await this.userRepository.removeTrustedContactFromUserById(request.userId, contact.id);

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

  private mapUserToResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };
  }
}

export const userService = new UserService(userRepository);
