import { IUser } from "../interfaces";

export default class UserDto {
  email: string;
  id: string;
  isActivated: boolean;
  roleName: string[];

  constructor(model: IUser) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.roleName = model.roleName;
  }
}
