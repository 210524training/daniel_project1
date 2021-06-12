export default class Reimbursement {
  constructor(
      public Thing = 'reimbursement',
      public ID: string,
      public EmpID: string,
      public Details: Details,
      public Urgent: boolean,
      public GradeSubmission: string,
      public PassedOrNot = 'passed' || 'failed' || 'waiting',
      public Supervisor = 'department head' || 'supervisor',
      public DS_PreApproval = 'waiting' || 'rejected' || 'approved',
      public DH_PreApproval = 'waiting' || 'rejected' || 'approved' || 'not yet' || 'no supervisor',
      public Benco_PreApproval = 'waiting' || 'rejected' || 'approved' || 'not yet' || 'cancelled',
      public PostApproval = 'waiting' || 'rejected' || 'approved' || 'not yet',
      public FinalAward: FinalAward,
      public EmpApproval = 'not yet' || 'waiting' || 'approved' || 'cancelled',
      public GradeCheck = 'not yet' || 'waiting' || 'approved' || 'denied',
  ) {}
}

export interface Details {
    EventType: string,
    RawCost: number,
    StartDate: string,
    EndDate: string,
    Location: string,
    Description: string,
    GradingFormat: string,
    GradeCutOff: string,
    Justification: string,
    ApprovalEmail: string,
    TrueCost: number,
    InterestedParties: string[],
}

export interface FinalAward {
    Amount:number,
    Differece:string,
    Reason: string,
}
