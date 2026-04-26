import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { UserController } from "../controllers/user.controller";
import { UserManagementService } from "../services/UserManagement.service";

const route = Router();
const userController = new UserController(new UserManagementService());

route
  .route("/")
  .post(asyncHandler(userController.createUser.bind(userController)))
  .get(asyncHandler(userController.getAllUsers.bind(userController)));

route
  .route("/:id")
  .get(asyncHandler(userController.getUser.bind(userController)))
  .put(asyncHandler(userController.updateUser.bind(userController)))
  .delete(asyncHandler(userController.deleteUser.bind(userController)));

export default route;

