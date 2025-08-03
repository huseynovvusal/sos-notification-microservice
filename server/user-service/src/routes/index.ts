import { Router } from 'express';
import userRouter from '@/routes/user.routes';

const router = Router();

router.use('/users', userRouter);

export default router;
