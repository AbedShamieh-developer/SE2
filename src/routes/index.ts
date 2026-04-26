import { Router } from "express";
import OrderRoutes from "./order.route";
import UserRoutes from "./user.route";
const routes  = Router();
routes.get('/',(req,res)=>{
    res.json({message: "Welcome to the API"});
})
routes.use('/orders',OrderRoutes)
routes.use('/users',UserRoutes)
export default routes;
