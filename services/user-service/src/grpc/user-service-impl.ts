import * as grpc from '@grpc/grpc-js';

import { userService } from '@/grpc/user-service';

export const userServiceImplementation: grpc.UntypedServiceImplementation = {
  createUser: userService.createUser.bind(userService),
  getUserById: userService.getUserById.bind(userService),
  getUserContacts: userService.getUserContacts.bind(userService),
  addContactToUser: userService.addContactToUser.bind(userService),
  removeContactFromUser: userService.removeContactFromUser.bind(userService)
};
