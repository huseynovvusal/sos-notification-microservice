import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { SignOptions } from 'jsonwebtoken';

import logger from '@/lib/logger';
import axios from 'axios';
import { config } from '@/config';
import { AppError } from '@/errors';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  const createUserApiUrl = `${config.USER_SERVICE_URL}/api/users`;

  const response = await axios.post(createUserApiUrl, {
    name,
    email,
    phone,
    password
  });

  const status = response.status;

  if (status === StatusCodes.CREATED) {
    logger.info(`User registered successfully: ${email}`);

    const token = generateToken(response.data.user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      user: response.data.user,
      accessToken: token
    });

    return;
  }

  const errorMessage = response.data?.message || 'Failed to register user';

  logger.error(`User registration failed: ${errorMessage}`);

  logger.debug(`Error details: ${JSON.stringify(response.data)}`);

  throw new AppError(errorMessage, status);
});

export const login = asyncHandler(async (_req: Request, _res: Response) => {});

const generateToken = (userId: string): string => {
  if (!config.JWT_SECRET) {
    throw new AppError('JWT secret is not defined', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: (config.JWT_EXPIRATION as SignOptions['expiresIn']) || '1h' });
};
