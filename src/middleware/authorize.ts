import { NextFunction, Request, Response } from "express";
import { Permission, Role } from "../config/roles";
import { AuthRequest } from "../config/types";
import { AuthenitactionException } from "../util/exceptions/http-exceptions/AuthenicationException";
import { InsufficientException, InvalidRoleException } from "../util/exceptions/http-exceptions/AuthorizationException";
import { rolePermissions } from "../config/roles";
import logger from "../util/logger";

export function hasPermission(permission: Permission){
    return (req: Request, res: Response, next: NextFunction)=>{
        const authRequest = req as AuthRequest;
        if(!authRequest.user){
            throw new AuthenitactionException()
        }
        const userRole = authRequest.user.role;
        if(!userRole){
            throw new AuthenitactionException()
        }
       
        if(!rolePermissions[userRole]){
            logger.error(`Invalid role ${userRole}}`);
            throw new InvalidRoleException(userRole);
        }
        if(!rolePermissions[userRole].includes(permission)){
            logger.error(`Invalid permission`);
            throw new InsufficientException();
        }
        next();
    }
}
export function hasRole(allowedRoles: Role[]){
    return (req: Request, res: Response, next: NextFunction)=>{
         const authRequest = req as AuthRequest;
        if(!authRequest.user){
            throw new AuthenitactionException()
        }
        const userRole = authRequest.user.role;
        if(!userRole){
            throw new AuthenitactionException()
        }
       
        if(!rolePermissions[userRole]){
            logger.error(`Invalid role ${userRole}}`);
            throw new InvalidRoleException(userRole);
        }
        if(!allowedRoles.includes(userRole)){
            logger.error(`Insufficient role ${userRole}`);
            throw new InsufficientException();
        }
        next();
    }
}

export function hasSelfOrRole(allowedRoles: Role[], paramKey: string = "id"){
    return (req: Request, res: Response, next: NextFunction)=>{
        const authRequest = req as AuthRequest;
        if(!authRequest.user){
            throw new AuthenitactionException()
        }
        const userRole = authRequest.user.role;
        if(!userRole){
            throw new AuthenitactionException()
        }

        if(!rolePermissions[userRole]){
            logger.error(`Invalid role ${userRole}}`);
            throw new InvalidRoleException(userRole);
        }

        const targetId = req.params[paramKey];
        const isSelf = !!targetId && authRequest.user.userId === targetId;
        const hasAllowedRole = allowedRoles.includes(userRole);

        if(!isSelf && !hasAllowedRole){
            logger.error(`Insufficient access for role ${userRole} on ${paramKey}=${targetId}`);
            throw new InsufficientException();
        }
        next();
    }
}

export function bindUserIdToParam(paramKey: string = "id"){
    return (req: Request, res: Response, next: NextFunction)=>{
        const authRequest = req as AuthRequest;
        if(!authRequest.user?.userId){
            throw new AuthenitactionException()
        }
        req.params[paramKey] = authRequest.user.userId;
        next();
    }
}
