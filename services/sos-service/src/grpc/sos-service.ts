import * as grpc from '@grpc/grpc-js';
import { sosServiceGrpc, userServiceGrpc } from '@sos-notification-microservice/shared';
import { userServiceClient } from './user-service-client';
import { produceSOSNotificationMessage } from '@/messaging/sos-notification.producer';
import { rabbitMQChannel } from '@/messaging/connection';

class SOSService {
  public async startSOS(
    call: grpc.ServerUnaryCall<sosServiceGrpc.StartSOSRequest, sosServiceGrpc.StartSOSResponse>,
    callback: grpc.sendUnaryData<sosServiceGrpc.StartSOSResponse>
  ) {
    const { userId, message } = call.request;

    let createUserResponse: userServiceGrpc.CreateUserResponse = await new Promise((resolve, reject) => {
      userServiceClient.getUserById({ userId }, (error, response) => {
        if (error) {
          console.error('Error fetching user:', error);
          reject({
            code: error.code,
            message: error.message
          });

          return;
        }

        resolve(response);
      });
    });

    const user = createUserResponse.user;

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found'
      });
    }

    const contactResponse: userServiceGrpc.GetUserContactsResponse = await new Promise((resolve, reject) => {
      userServiceClient.getUserContacts({ userId }, (error, response) => {
        if (error) {
          console.error('Error fetching user contacts:', error);
          reject({
            code: error.code,
            message: error.message
          });
          return;
        }

        resolve(response);
      });
    });

    const contacts = contactResponse.contacts;

    if (contacts.length === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'No contacts found for the user'
      });
    }

    for (let contact of contacts) {
      produceSOSNotificationMessage(rabbitMQChannel, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        contact: {
          phone: contact.phone,
          email: contact.email
        },
        message
      });
    }

    callback(null, {
      success: true
    });
  }
}

export const sosServie = new SOSService();
