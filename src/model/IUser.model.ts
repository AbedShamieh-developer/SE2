import { Role } from "../config/roles";
import { ID } from "../repository/IRepository";

export interface IUser extends ID {
  getName(): string;
  getEmail(): string;
  getPassword(): string;
  getRole(): Role;
}

