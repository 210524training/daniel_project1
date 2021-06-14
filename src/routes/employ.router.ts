import { Router } from 'express';
import path from 'path';
import Detail from '../models/detail';
import userDao from '../dao/userDao';

const employRouter = Router();

employRouter.get('/', async (req, res) => {
  if(req.session.user) {
    res.sendFile(path.resolve(__dirname, '../views/employee.html'));
  }
});

employRouter.get('/reim/json', async (req, res) => {
  if(req.session.user) {
    if(req.session.user.Role === 'supervisor') {
      const data = await userDao.getPreApproval('DS_PreApproval');
      res.json({ res: data });
    } else if(req.session.user.Role === 'benco') {
      const data = await userDao.getPreApproval('Benco_PreApproval');
      res.json({ res: data });
    } else if(req.session.user.Role === 'department head') {
      const data = await userDao.getPreApproval('DH_PreApproval');
      res.json({ res: data });
    }
  }
});

employRouter.put('/reim', async (req, res) => {
  // const r = JSON.parse(req.body);
  console.log(req);
  const {
    id,
    eventType,
    rawCost,
    startDate,
    endDate,
    location,
    description,
    gradingFormat,
    justification,
    approverEmail,
  } = req.body;
  const trueCost = Number(rawCost) * (7 / 10); // needs to be fixed
  const detail = new Detail(eventType,
    rawCost,
    startDate,
    endDate,
    location,
    description,
    gradingFormat,
    justification,
    approverEmail,
    trueCost,
    []);
  console.log(detail);
  if(req.session.user) {
    const daoRes = await userDao.putReim(detail, id);
    res.json({ submission: daoRes });
  }
});

export default employRouter;
