import * as grpc from '@grpc/grpc-js';

import { userService } from '@/services/user.service';

export const userServiceImplementation: grpc.UntypedServiceImplementation = {
  createUser: userService.createUser.bind(userService),
  getUserById: userService.getUserById.bind(userService)
};
