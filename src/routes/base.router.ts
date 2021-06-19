import express, { Router } from 'express';
import path from 'path';
import loginRouter from './login.router';
import employRouter from './employ.router';

const baseRouter = Router();

baseRouter.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/index.html'));
});

export async function logout(req: express.Request, res: express.Response): Promise<void> {
  req.session.destroy(() => {
    res.send('logged out!');
  });
}

baseRouter.use('/login', loginRouter);
baseRouter.use('/employee', employRouter);
baseRouter.use('/logout', logout);
// baseRouter.use('/api/v1/users', userRouter);

export default baseRouter;
