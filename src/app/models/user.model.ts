export class User {
  public id: string;
  public active: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public phone: string;
  public sex: string;
  public link: any;
  public photo: any;

  constructor(user: any) {
    Object.keys(user).forEach((key) => this[key] = user[key]);
  }
}
