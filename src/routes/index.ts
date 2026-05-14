import { Request, Response, Router } from "express";
import OrderRoutes from "./order.route";
import UserRoutes from "./user.route";
import AuthRoute from "./auth.route";
import { authenticate } from "../middleware/auth";
import { hasRole } from "../middleware/authorize";
import { Role } from "../config/roles";
import AdminRoutes from "./admin.route";
import { ConnectionManager } from "../repository/sqlite/ConnectionManager";
const routes  = Router();
routes.get('/',(req,res)=>{
    res.json({message: "Welcome to the API"});
})
routes.use('/orders',authenticate,OrderRoutes)
routes.use('/users',UserRoutes)
routes.use('/auth',AuthRoute)
routes.use('/admin',authenticate,hasRole([Role.admin]),AdminRoutes)
routes.use('/health/status',(req: Request,res: Response)=>{
    res.status(200).json({message: "OK"})
})
routes.use('/health/db',(req: Request,res: Response)=>{
    let dbStatus = checkDBConnection();
    if(!dbStatus){
        res.status(500).json({message: "Database connection failed"})
    }
    res.status(200).json({message: "OK"})
})
function checkDBConnection(): Promise<boolean>{
    return ConnectionManager.getConnection().then(()=> true).catch(()=> false)
}
export default routes;
