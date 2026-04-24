import {NextFunction, Request, Response, Router} from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderManagementService } from "../services/OrderManagement.service";
import  {asyncHandler}  from "../middleware/asyncHandler";
const route = Router();

const orderController = new OrderController(new OrderManagementService())


route.route('/')
     .post(asyncHandler(orderController.createOrder.bind(orderController)))
     .get(asyncHandler(orderController.getAllOrders.bind(orderController)));
     
route.route('/revenue')
     .get(asyncHandler(orderController.getTotalRevenue.bind(orderController)));
route.route('/total-orders')
     .get(asyncHandler(orderController.getTotalOrders.bind(orderController)))

route.route('/:id')
     .get(asyncHandler(orderController.getOrder.bind(orderController)))
     .put(asyncHandler(orderController.updateOrder.bind(orderController)))
     .delete(asyncHandler(orderController.deleteOrder.bind(orderController)));


export default route;

