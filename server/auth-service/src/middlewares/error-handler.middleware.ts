import { Request, Response, NextFunction } from 'express';

import { AppError } from '@/errors';
import axios from 'axios';
import logger from '@/lib/logger';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';

  if (axios.isAxiosError(err)) {
    logger.error(`Axios error during user registration: ${err.message}`);

    statusCode = err.response?.status || 500;
    message = err.response?.data?.message || 'Failed to register user';
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
