import express, { Router } from 'express';
import path from 'path';
import userDao from '../dao/userDao';

const loginRouter = Router();

loginRouter.get('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    res.sendFile(path.resolve(__dirname, '../views/login.html'));
  }
});

loginRouter.post('/', async (req: express.Request<unknown, unknown, { id: string, password: string }, unknown, {}>, res) => {
  const { id, password } = req.body;
  const user = await userDao.getUser(id);
  console.log(id);
  if(user === undefined) {
    res.send('User ID not found.');
  }
  if(user !== undefined && user.Password === password) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.json(req.session.user);
  } else {
    res.send('wrong password');
  }
});

export default loginRouter;
