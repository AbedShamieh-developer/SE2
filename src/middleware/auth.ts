import { Request, Response,NextFunction } from "express";
import { AuthenticationFailedException } from "../util/exceptions/http-exceptions/AuthenicationException";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthRequest } from "../config/types";
import { rolePermissions } from "../config/roles";

const authService = new AuthenticationService();

export function authenticate(req: Request, res: Response, next: NextFunction) {
    // get token from header
    let token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    // if no token then throw auth error
    if (!token) {
      if(!refreshToken){
        throw new AuthenticationFailedException();
      }
      // check if their is a refresh token
      // if yes generate a new access token , save into cookie ,next
      if(refreshToken){
        const newToken = authService.refreshToken(refreshToken)
        authService.setTokenIntoCookie(res,newToken);
        token = newToken
      }
    }
    // verify token
    const payload = authService.verify(token);
    if (!payload?.userId || !payload?.role || !rolePermissions[payload.role]) {
      throw new AuthenticationFailedException();
    }
    //add payload to the request
    (req as AuthRequest).user = payload;
    // call next
    next();
}
