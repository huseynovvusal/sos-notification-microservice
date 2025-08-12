import * as grpc from '@grpc/grpc-js';
import { authService } from '@/grpc/auth-service';

export const authServiceImplementation: grpc.UntypedServiceImplementation = {
  register: authService.register.bind(authService),
  login: authService.login.bind(authService)
};
