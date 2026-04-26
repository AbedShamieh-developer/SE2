import { Request, Response } from "express";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";
import { UserManagementService } from "../services/UserManagement.service";

export class UserController {
  constructor(private readonly userService: UserManagementService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body ?? {};
    this.validateRequestBody(name, email, password);
    const createdUser = await this.userService.createUser({ name, email, password });
    if (!createdUser) {
      throw new BadRequestException("User not created", { UserNotDefined: !createdUser });
    }
    res.status(201).json({
      user: {
        id: createdUser.getId(),
        name: createdUser.getName(),
        email: createdUser.getEmail(),
      },
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    const user = await this.userService.getUser(id);
    res.status(200).json({
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      },
    });
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();
    if (!users) {
      throw new BadRequestException("Users not found", { UsersNotDefined: !users });
    }
    res.status(200).json({
      users: users.map((user) => ({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      })),
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { name, email, password } = req.body ?? {};
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    this.validateRequestBody(name, email, password);
    const updatedUser = await this.userService.updateUser(id, { name, email, password });
    if (!updatedUser) {
      throw new BadRequestException("User not updated", { UserNotDefined: !updatedUser });
    }
    res.status(200).json({
      user: {
        id: updatedUser.getId(),
        name: updatedUser.getName(),
        email: updatedUser.getEmail(),
      },
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) {
      throw new BadRequestException("Id is required", { IdNotDefined: true });
    }
    await this.userService.deleteUser(id);
    res.status(200).json({ status: "User Deleted Successfully" });
  }

  private validateRequestBody(name: unknown, email: unknown, password: unknown): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const details = {
      NameNotDefined: typeof name !== "string" || name.trim().length === 0,
      EmailNotDefined: typeof email !== "string" || email.trim().length === 0,
      EmailInvalidFormat: typeof email === "string" && normalizedEmail.length > 0 && !emailRegex.test(normalizedEmail),
      PasswordNotDefined: typeof password !== "string" || password.trim().length === 0,
    };

    if (details.NameNotDefined || details.EmailNotDefined || details.EmailInvalidFormat || details.PasswordNotDefined) {
      throw new BadRequestException("Invalid user payload", details);
    }
  }

}
