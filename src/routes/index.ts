import { Router } from "express";
import OrderRoutes from "./order.route";
import UserRoutes from "./user.route";
import AuthRoute from "./auth.route";
import { authenticate } from "../middleware/auth";
import { hasRole } from "../middleware/authorize";
import { Role } from "../config/roles";
import AdminRoutes from "./admin.route";
const routes  = Router();
routes.get('/',(req,res)=>{
    res.json({message: "Welcome to the API"});
})
routes.use('/orders',authenticate,OrderRoutes)
routes.use('/users',UserRoutes)
routes.use('/auth',AuthRoute)
routes.use('/admin',authenticate,hasRole([Role.admin]),AdminRoutes)
export default routes;
