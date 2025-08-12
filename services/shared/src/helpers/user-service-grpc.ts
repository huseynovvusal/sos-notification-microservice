import { ChannelCredentials, credentials } from "@grpc/grpc-js"
import { UserServiceClient } from "../proto/user_service"

export function createUserServiceClient(address: string, c: ChannelCredentials) {
  return new UserServiceClient(address, credentials.createInsecure())
}
