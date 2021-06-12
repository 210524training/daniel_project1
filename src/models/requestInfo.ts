export default class RequestInfo {
  constructor(
        public Thing = 'additional info',
        public ID: string,
        public EmpID: string,
        public ReimID: string,
        public requestor: string, // who requests it
        public Request: string, // what additional info they want
        public SendTo: string, // user ID
        public Answer: string,
        public resolved: boolean,
  ) {}
}
