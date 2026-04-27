import { Request, Response } from "express";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";
import { UserManagementService } from "../services/UserManagement.service";
import { toRole } from "../config/roles";

export class AdminController {
  constructor(private readonly userService: UserManagementService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();
    res.status(200).json({
      users: users.map((user) => ({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
      })),
    });
  }

  async updateUserRole(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const role = req.body?.role;
    if (!id || typeof role !== "string" || role.trim().length === 0) {
      throw new BadRequestException("Id and role are required", {
        IdNotDefined: !id,
        RoleNotDefined: typeof role !== "string" || role.trim().length === 0,
      });
    }
    const normalizedRole = toRole(role);
    const updatedUser = await this.userService.updateUserRole(id, normalizedRole);
    res.status(200).json({
      user: {
        id: updatedUser.getId(),
        name: updatedUser.getName(),
        email: updatedUser.getEmail(),
        role: updatedUser.getRole(),
      },
    });
  }
}
