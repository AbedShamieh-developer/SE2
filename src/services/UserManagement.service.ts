import { generateUuid } from "../util";
import { IUser } from "../model/IUser.model";
import { User } from "../model/User.model";
import { createRepository, UserRepository } from "../repository/sqlite/User.repository";
import { NotFoundException } from "../util/exceptions/http-exceptions/NotFoundException";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";

export type UserInput = {
  name: string;
  email: string;
  password: string;
};

export class UserManagementService {
  private userRepository?: UserRepository;

  async createUser(input: UserInput): Promise<IUser> {
    const repo = await this.getRepository();
    this.validateUserPayload(input);
    const user = new User(generateUuid("user"), input.name, input.email, input.password);
    await repo.create(user);
    return user;
  }

  async getUser(id: string): Promise<IUser> {
    const repo = await this.getRepository();
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    try {
      return await repo.get({ getId: () => id });
    } catch (error) {
      throw new NotFoundException("User Not Found", { id });
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    const repo = await this.getRepository();
    return repo.getAll();
  }

  async updateUser(id: string, input: UserInput): Promise<IUser> {
    const repo = await this.getRepository();
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    this.validateUserPayload(input);
    const user = new User(id, input.name, input.email, input.password);
    try {
      await repo.update(user);
      return user;
    } catch (error) {
      throw new NotFoundException("User Not Found", { id });
    }
  }

  async deleteUser(id: string): Promise<void> {
    const repo = await this.getRepository();
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    try {
      await repo.delete({ getId: () => id });
    } catch (error) {
      throw new NotFoundException("User Not Found", { id });
    }
  }

  private validateUserPayload(input: UserInput): void {
    const details = {
      NameNotDefined: !input.name || input.name.trim().length === 0,
      EmailNotDefined: !input.email || input.email.trim().length === 0,
      PasswordNotDefined: !input.password || input.password.trim().length === 0,
    };

    if (details.NameNotDefined || details.EmailNotDefined || details.PasswordNotDefined) {
      throw new BadRequestException(
        "Invalid user payload",
        details,
      );
    }
  }
  private async getRepository(): Promise<UserRepository> {
    if (!this.userRepository) {
      this.userRepository = await createRepository();
    }
    return this.userRepository;
  }
}
