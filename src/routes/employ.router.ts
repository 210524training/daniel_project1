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

employRouter.get('/benco/reim/graded', async (req, res) => {
  if(req.session.user) {
    if(req.session.user.Role === 'benco') {
      const data = await userDao.getReimGradeCheck();
      res.json({ res: data });
    }
  }
});

employRouter.patch('/benco/reim/graded', async (req, res) => {
  const { id, approve } = req.body;
  if(req.session.user) {
    if(req.session.user.Role === 'benco') {
      const data = await userDao.updateGradeCheck(id, approve);
      res.json({ res: data });
    }
  }
});

employRouter.get('/reim/approval', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getReimEmpApproval(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.patch('/reim/approval', async (req, res) => {
  const { id, approve } = req.body;
  if(req.session.user) {
    const data = await userDao.updateEmpApproval(id, approve);
    res.json({ res: data });
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

employRouter.patch('/prereim', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      approve,
      reason,
    } = req.body;
    const role = req.session.user.Role;
    let d;
    if(role === 'supervisor') {
      d = await userDao.updatePreApproval(reimID, 'DS_PreApproval', approve, reason);
    } else if(role === 'department head') {
      d = await userDao.updatePreApproval(reimID, 'DH_PreApproval', approve, reason);
    } else {
      d = await userDao.updatePreApproval(reimID, 'Benco_PreApproval', approve, reason);
    }
    console.log(d);
    res.send(d);
  }
});

employRouter.patch('/postreim', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      approve,
      reason,
      finalAmount,
    } = req.body;
    const reim = await userDao.getReim(reimID);
    let empApproval = 'approved';
    if(reim) {
      if(reim.Details.TrueCost < finalAmount) {
        empApproval = 'waiting';
      }
    }
    const d = await userDao.updatePostApproval(reimID, finalAmount, approve, reason, empApproval);
    console.log(d);
    res.send(d);
  }
});

export default employRouter;
