import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';
import { testRouter } from './test';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/test', testRouter);
// All routes go here

export { v1Router };
