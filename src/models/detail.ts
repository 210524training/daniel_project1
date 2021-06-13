export default class Detail {
  constructor(
    public EventType: string,
    public RawCost: number,
    public StartDate: string,
    public EndDate: string,
    public Location: string,
    public Description: string,
    public GradingFormat: string,
    // public GradeCutOff: string,
    public Justification: string,
    public ApprovalEmail: string,
    public TrueCost: number,
    public InterestedParties: string[],
  ) {}
}
