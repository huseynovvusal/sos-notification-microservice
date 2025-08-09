import { config } from '@/config';
import Auth from '@/models/auth.model';
import * as grpc from '@grpc/grpc-js';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { userServiceClient } from './user-service-client';
import { authServiceGrpc, userServiceGrpc } from '@sos-notification-microservice/shared';
import logger from '@/lib/logger';

export class AuthService {
  public async register(
    call: grpc.ServerUnaryCall<authServiceGrpc.RegisterRequest, authServiceGrpc.RegisterResponse>,
    callback: grpc.sendUnaryData<authServiceGrpc.RegisterResponse>
  ) {
    const { name, phone, email, password } = call.request;

    let createUserResponse: userServiceGrpc.CreateUserResponse = await new Promise((resolve, reject) => {
      userServiceClient.createUser({ name, phone, email }, (err, response) => {
        if (err) {
          logger.error('Error creating user:', err);

          reject({
            code: err.code,
            details: err.message
          });
        }

        resolve(response);
      });
    });

    logger.debug('User created successfully', JSON.stringify(createUserResponse, null, 2));

    const hashedPassword = await this.hashPassword(password);

    const auth = await Auth.create({
      userId: createUserResponse?.user?.id,
      email,
      passwordHash: hashedPassword
    });

    const accessToken = this.generateToken(auth.id);

    callback(null, { accessToken: accessToken });
  }

  public async login(
    call: grpc.ServerUnaryCall<authServiceGrpc.LoginRequest, authServiceGrpc.LoginResponse>,
    callback: grpc.sendUnaryData<authServiceGrpc.LoginResponse>
  ) {
    const { email, password } = call.request;

    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        details: 'Invalid password'
      });
    }

    const accessToken = this.generateToken(user.id);

    callback(null, { accessToken });
  }

  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, config.JWT_SECRET!, { expiresIn: (config.JWT_EXPIRATION as SignOptions['expiresIn']) || '1h' });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

export const authService = new AuthService();
