import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '@/lib/logger';

export const register = asyncHandler(async (req: Request, res: Response) => {});

export const login = asyncHandler(async (req: Request, res: Response) => {});
