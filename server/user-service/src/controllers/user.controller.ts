import asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  const user = new User({
    name,
    email,
    phone
  });

  const createdUser = await user.save();

  res.status(StatusCodes.CREATED).json({
    data: createdUser
  });
});
