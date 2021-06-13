import detail from './detail';

export default class Reimbursement {
  constructor(
      public Thing = 'reimbursement',
      public ID: string,
      public EmpID: string,
      public Details: detail,
      public Urgent: boolean,
      public GradeSubmission: string,
      public PassedOrNot = 'passed' || 'failed' || 'waiting',
      public Supervisor = 'department head' || 'supervisor',
      public DS_PreApproval = 'waiting' || 'rejected' || 'approved',
      public DH_PreApproval = 'waiting' || 'rejected' || 'approved' || 'not yet' || 'no supervisor',
      public Benco_PreApproval = 'waiting' || 'rejected' || 'approved' || 'not yet' || 'cancelled',
      public PostApproval = 'waiting' || 'rejected' || 'approved' || 'not yet',
      public FinalAmount:number,
      public Difference:string,
      public Reason: string,
      public EmpApproval = 'not yet' || 'waiting' || 'approved' || 'cancelled',
      public GradeCheck = 'not yet' || 'waiting' || 'approved' || 'denied',
  ) {}
}
