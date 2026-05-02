import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { UserManagementService } from "../services/UserManagement.service";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthenticationController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { UserController } from "../controllers/user.controller";

const route = Router();
const authService = new AuthenticationService();
const userService = new UserManagementService();
const authController = new AuthenticationController(authService, userService);
const userController = new UserController(userService);

route
  .route("/login")
  .post(asyncHandler(authController.login.bind(authController)));

route
  .route("/register")
  .post(asyncHandler(userController.createUser.bind(userController)));

route
  .route("/logout")
  .get(authenticate,asyncHandler(authController.logout.bind(authController)));

export default route;
