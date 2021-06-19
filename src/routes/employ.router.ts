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

employRouter.get('/super/prereim', async (req, res) => {
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
  if(req.session.user && req.session.user.Role === 'benco') {
    const data = await userDao.getReimGradeCheck();
    res.json({ res: data });
  }
});

employRouter.patch('/benco/reim/graded', async (req, res) => {
  const { id, approve } = req.body;
  if(req.session.user && req.session.user.Role === 'benco') {
    const data = await userDao.updateGradeCheck(id, approve);
    res.json({ res: data });
  }
});

employRouter.get('/reim/approval', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getReimEmpApproval(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.patch('/reim/changeapproval', async (req, res) => {
  const { id, approve } = req.body;
  if(req.session.user) {
    const data = await userDao.updateEmpApproval(id, approve);
    res.json({ res: data });
  }
});

employRouter.patch('/reim/grade', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      grade,
    } = req.body;
    userDao.updateToWaiting(reimID, 'PostApproval');
    const d = await userDao.postGrade(reimID, grade);
    console.log(d);
    res.send(d);
  }
});

employRouter.put('/reim', async (req, res) => {
  // const r = JSON.parse(req.body);
  console.log(req);
  const {
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
    console.log('logged in', req.session.user.ID);
    const daoRes = await userDao.putReim(detail, req.session.user.ID);
    res.json({ submission: daoRes });
  }
});

employRouter.patch('/super/prereim', async (req, res) => {
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
      userDao.updateToWaiting(reimID, 'DH_PreApproval');
    } else if(role === 'department head') {
      d = await userDao.updatePreApproval(reimID, 'DH_PreApproval', approve, reason);
      userDao.updateToWaiting(reimID, 'Benco_PreApproval');
    } else {
      d = await userDao.updatePreApproval(reimID, 'Benco_PreApproval', approve, reason);
    }
    console.log(d);
    res.send(d);
  }
});

employRouter.patch('/super/postreim', async (req, res) => {
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
