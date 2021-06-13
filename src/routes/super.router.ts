import { Router } from 'express';
import path from 'path';

const superRouter = Router();

superRouter.get('/', async (req, res) => {
  if(req.session.user) {
    res.sendFile(path.resolve(__dirname, '../views/super.html'));
  }
});

superRouter.get('/reim/json', async (req, res) => {
  if(req.session.user) {
    // dao
    res.json({ data: 'This is sending back JSON' });
    throw new Error('Something went wrong!');
  }
});

superRouter.put('/reim', async (req, res) => {
  if(req.session.user) {
    // dao
    res.json({ data: 'This is sending back JSON' });
    throw new Error('Something went wrong!');
  }
});

export default superRouter;
