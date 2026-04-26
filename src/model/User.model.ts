import { IUser } from "./IUser.model";

export class User implements IUser {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}

