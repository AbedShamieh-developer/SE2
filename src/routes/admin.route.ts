import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AdminController } from "../controllers/admin.controller";
import { UserManagementService } from "../services/UserManagement.service";

const route = Router();
const adminController = new AdminController(new UserManagementService());

route
  .route("/users")
  .get(asyncHandler(adminController.getAllUsers.bind(adminController)));

route
  .route("/users/:id/role")
  .patch(asyncHandler(adminController.updateUserRole.bind(adminController)));

export default route;
