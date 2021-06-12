export default class User {
  constructor(
    public Thing = 'user',
    public ID: string,
    public Password: string,
    public Role = 'employee' || 'supervisor' || 'benco' || 'department head',
  ) {}
}
