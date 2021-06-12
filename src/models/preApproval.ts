export default class PreApproval {
  constructor(
        public Thing = 'pre-approval',
        public ID: string,
        public EmpID: string,
        public ReimID: string,
        public SendTo = 'benco' || 'supervisor' || 'head', // user ID
        public deadline: string,
        public additionalInfo: boolean,
        public reason: string,
        public status = 'waiting' || 'approved' || 'denied',
  ) {}
}
