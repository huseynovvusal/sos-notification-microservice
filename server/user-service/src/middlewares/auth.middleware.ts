import { UnauthorizedError } from '@/errors';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const authMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  req.user = {
    id: req.user.id,
    email: req.user.email
  };

  next();
});
