import { Router } from 'express';
import { addContactToUser, createUser, getUserById, removeContactFromUser } from '@/controllers/user.controller';

const userRouter = Router();

userRouter.get('/:userId', getUserById);

userRouter.post('/', createUser);

userRouter.post('/:userId/contacts', addContactToUser);
userRouter.delete('/:userId/contacts/:contactEmail', removeContactFromUser);

export default userRouter;
