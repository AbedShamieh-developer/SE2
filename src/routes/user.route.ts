import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { UserController } from "../controllers/user.controller";
import { UserManagementService } from "../services/UserManagement.service";
import { authenticate } from "../middleware/auth";
import { bindUserIdToParam, hasPermission, hasRole, hasSelfOrRole } from "../middleware/authorize";
import { Permission, Role } from "../config/roles";

const route = Router();
const userController = new UserController(new UserManagementService());

route
  .route("/")
  .get(authenticate,hasRole([Role.admin]),asyncHandler(userController.getAllUsers.bind(userController)));

route
  .route("/me")
  .get(
    authenticate,
    hasPermission(Permission.READ_USER),
    bindUserIdToParam("id"),
    asyncHandler(userController.getUser.bind(userController)),
  )
  .put(
    authenticate,
    hasPermission(Permission.UPDATE_USER),
    bindUserIdToParam("id"),
    asyncHandler(userController.updateUser.bind(userController)),
  )
  .delete(
    authenticate,
    hasPermission(Permission.DELETE_USER),
    bindUserIdToParam("id"),
    asyncHandler(userController.deleteUser.bind(userController)),
  );

route
  .route("/:id")
  .get(
    authenticate,
    hasPermission(Permission.READ_USER),
    hasSelfOrRole([Role.admin]),
    asyncHandler(userController.getUser.bind(userController)),
  )
  .put(
    authenticate,
    hasPermission(Permission.UPDATE_USER),
    hasSelfOrRole([Role.admin]),
    asyncHandler(userController.updateUser.bind(userController)),
  )
  .delete(
    authenticate,
    hasPermission(Permission.DELETE_USER),
    hasSelfOrRole([Role.admin]),
    asyncHandler(userController.deleteUser.bind(userController)),
  );

export default route;
