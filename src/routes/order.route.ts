import {NextFunction, Request, Response, Router} from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderManagementService } from "../services/OrderManagement.service";
import  {asyncHandler}  from "../middleware/asyncHandler";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/roles";
const route = Router();

const orderController = new OrderController(new OrderManagementService())


route.route('/')
     .post(hasPermission(Permission.WRITE_ORDER),asyncHandler(orderController.createOrder.bind(orderController)))
     .get(hasPermission(Permission.READ_ORDER),asyncHandler(orderController.getAllOrders.bind(orderController)));
     
route.route('/revenue')
     .get(hasPermission(Permission.READ_ORDER),asyncHandler(orderController.getTotalRevenue.bind(orderController)));
route.route('/total-orders')
     .get(hasPermission(Permission.READ_ORDER),asyncHandler(orderController.getTotalOrders.bind(orderController)))

route.route('/:id')
     .get(hasPermission(Permission.READ_ORDER),asyncHandler(orderController.getOrder.bind(orderController)))
     .put(hasPermission(Permission.UPDATE_ORDER),asyncHandler(orderController.updateOrder.bind(orderController)))
     .delete(hasPermission(Permission.DELETE_ORDER),asyncHandler(orderController.deleteOrder.bind(orderController)));


export default route;
