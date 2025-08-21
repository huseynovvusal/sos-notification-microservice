import * as grpc from '@grpc/grpc-js';
import { sosService } from '@/grpc/sos-service';

export const sosServiceImplementation: grpc.UntypedServiceImplementation = {
  startSos: sosService.startSOS.bind(sosService)
};
