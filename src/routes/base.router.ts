import express, { Router } from 'express';
import path from 'path';
import userRouter from './user.router';
import loginRouter from './login.router';
import employRouter from './employ.router';

const baseRouter = Router();

baseRouter.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/index.html'));
});

baseRouter.get('/json', async (req, res) => {
  console.log('Our callback was invoked!');
  res.json({ data: 'This is sending back JSON' });
  throw new Error('Something went wrong!');
});

export async function logout(req: express.Request, res: express.Response): Promise<void> {
  if(req.session.user) {
    const { ID } = req.session.user;
    req.session.destroy(() => {
      console.log(`${ID} logged out`);
      res.sendFile(path.resolve(__dirname, '../views/logout.html'));
    });
  }
  res.sendFile(path.resolve(__dirname, '../views/logout.html'));
}

baseRouter.use('/login', loginRouter);
baseRouter.use('/employee', employRouter);
baseRouter.use('/logout', logout);
baseRouter.use('/api/v1/users', userRouter);

export default baseRouter;
