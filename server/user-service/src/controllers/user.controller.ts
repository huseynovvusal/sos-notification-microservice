import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import User from '@/models/user.model';
import { BadRequestError, NotFoundError } from '@/errors';
import logger from '@/lib/logger';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  const user = new User({
    name,
    email,
    phone,
    password
  });

  const createdUser = await user.save();

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: createdUser
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('contacts');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

// TODO: User details including id and email will be provided inside the user property of the request parameter.
export const addContactToUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { contactEmail } = req.body;

  if (!contactEmail) {
    throw new BadRequestError('Contact email is required');
  }

  // ! Validate that contactEmail is provided
  logger.debug(`Adding contact with email ${contactEmail} to user with ID ${userId}`);

  const contact = await User.findOne({ email: contactEmail });

  if (!contact) {
    throw new NotFoundError('Contact not found');
  }

  if (contact.id === userId) {
    throw new BadRequestError('Cannot add yourself as a contact');
  }

  const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { contacts: contact.id } }, { new: true }).populate('contacts');

  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// TODO: User details including id and email will be provided inside the user property of the request parameter.
export const removeContactFromUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, contactEmail } = req.params;

  const contact = await User.findOne({ email: contactEmail });

  if (!contact) {
    throw new NotFoundError('Contact not found');
  }

  const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { contacts: contact.id } }, { new: true }).populate('contacts');

  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
