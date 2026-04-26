import { ID } from "../repository/IRepository";

export interface IUser extends ID {
  getName(): string;
  getEmail(): string;
  getPassword(): string;
}

