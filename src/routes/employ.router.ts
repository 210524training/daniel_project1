import { Router } from 'express';
import path from 'path';
import Detail from '../models/detail';
import userDao from '../dao/userDao';
import RequestInfo from '../models/requestInfo';

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
    const data = await userDao.getReimGradeCheck('grade');
    res.json({ res: data });
  }
});

employRouter.get('/info', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getUser(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.get('/reim/info', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getAllReim(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.get('/super/reim/graded', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getReimGradeCheck('presentation');
    res.json({ res: data });
  }
});

employRouter.patch('/benco/graded', async (req, res) => {
  const { reimID, approve } = req.body;
  if(req.session.user) {
    const data = await userDao.updateStuff(reimID, 'reimbursement', 'GradeCheck', approve);
    if(data.Attributes) {
      const cp = Number(data.Attributes.Details.TrueCost) * -1;
      const a = await userDao.updateFund(data.Attributes.EmpID, cp, 0);
      console.log(a);
    }
    res.json({ res: data });
  }
});

employRouter.get('/moreinfo', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getRequestInfo(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.get('/super/moreinfo', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getRequestSuper(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.put('/super/moreinfo', async (req, res) => {
  const { reimID, request, empId } = req.body;
  if(req.session.user) {
    const uID = String(Math.floor(Math.random() * 100000));
    const reqInfo = new RequestInfo('additional info',
      uID,
      reimID,
      req.session.user.ID,
      request,
      empId,
      'waiting',
      false);
    const data = await userDao.putMoreInfo(reqInfo);
    res.json({ res: data });
  }
});

employRouter.patch('/moreinfo', async (req, res) => {
  const { requestID, answer } = req.body;
  if(req.session.user) {
    const data = await userDao.updateStuff(requestID, 'additional info', 'Answer', answer);
    res.json({ res: data });
  }
});

employRouter.get('/reim/approval', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getReimEmpApproval(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.patch('/reim/file', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      formData,
    } = req.body;
    console.log(formData);
    const d = await userDao.updateStuff(reimID, 'reimbursement', 'file', formData);
    console.log(d);
    res.send(d);
  }
});

employRouter.get('/grades', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getGradeSubs(req.session.user.ID);
    res.json({ res: data });
  }
});

employRouter.patch('/reim/changeapproval', async (req, res) => {
  const { reimID, approve } = req.body;
  if(req.session.user) {
    const data = await userDao.updateStuff(reimID, 'reimbursement', 'EmpApproval', approve);
    if(approve === 'approved') {
      userDao.updateToWaiting(reimID, 'gradeSubmission');
    }
    res.json({ res: data });
  }
});

employRouter.patch('/reim/grade', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      grade,
    } = req.body;
    userDao.updateToWaiting(reimID, 'GradeCheck');
    const d = await userDao.updateStuff(reimID, 'reimbursement', 'gradeSubmission', grade);
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
  let trueCost = Number(rawCost) * (3 / 10);
  if(eventType === 'University Course') {
    trueCost = Number(rawCost) * (8 / 10);
  } else if(eventType === 'Seminar') {
    trueCost = Number(rawCost) * (6 / 10);
  } else if(eventType === 'Certification Prep Class') {
    trueCost = Number(rawCost) * (75 / 100);
  } else if(eventType === 'Certification') {
    trueCost = Number(rawCost);
  } else if(eventType === 'Technical Training') {
    trueCost = Number(rawCost) * (9 / 10);
  }
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
    const a = await userDao.updateFund(req.session.user.ID, trueCost, -trueCost);
    console.log(a);
    const daoRes = await userDao.putReim(detail, req.session.user.ID);
    res.json(daoRes);
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
      if(approve === 'approved') {
        userDao.updateToWaiting(reimID, 'DH_PreApproval');
      }
    } else if(role === 'department head') {
      d = await userDao.updatePreApproval(reimID, 'DH_PreApproval', approve, reason);
      if(approve === 'approved') {
        userDao.updateToWaiting(reimID, 'PostApproval');
      }
    } else {
      d = await userDao.updatePreApproval(reimID, 'PostApproval', approve, reason);
      if(approve === 'approved') {
        userDao.updateToWaiting(reimID, 'gradeSubmission');
      }
    }
    console.log(d);
    res.send(d);
  }
});

employRouter.get('/benco/postreim', async (req, res) => {
  if(req.session.user) {
    const data = await userDao.getPostApproval();
    res.json({ res: data });
  }
});

employRouter.patch('/benco/postreim', async (req, res) => {
  if(req.session.user) {
    const {
      reimID,
      approve,
      reason,
      finalAmount,
    } = req.body;
    const reim = await userDao.getReim(reimID);
    let empApproval = 'approved';
    if(reim && approve === 'approved') {
      if(reim.Details.TrueCost > finalAmount) {
        empApproval = 'waiting';
      }
    }
    const d = await userDao.updatePostApproval(reimID, finalAmount, approve, reason, empApproval);
    if(approve === 'approved' && empApproval === 'approved') {
      const dd = await userDao.updateToWaiting(reimID, 'gradeSubmission');
      console.log(dd);
    }
    console.log(d);
    res.send(d);
  }
});

export default employRouter;
