export default class RequestInfo {
  constructor(
        public Thing = 'additional info',
        public ID: string,
        public ReimID: string,
        public Requestor: string, // who requests it
        public Request: string, // what additional info they want
        public EmpId: string, // send to
        public Answer: string,
        public Resolved: boolean,
  ) {}
}
