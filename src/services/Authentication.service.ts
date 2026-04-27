import jwt from "jsonwebtoken";
import { TokenPayload, UserPayload } from "../config/types";
import config from '../config/index'
import { InvalidTokenException, TokenExpiredException } from "../util/exceptions/http-exceptions/AuthenicationException";
import logger from "../util/logger";
import { ServiceException } from "../util/exceptions/ServiceException";
import { Response } from "express";
import ms from "ms";

export class AuthenticationService {
    constructor(
        private secretKey = config.auth.secretKey,
        private tokenExpiration = config.auth.tokenExpiration,
        private refreshTokenExpiration = config.auth.refreshTokenExpiration
    ){}
    // create token
    generateToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {expiresIn: this.tokenExpiration}
        );
    }
    generateRefreshToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {expiresIn: this.refreshTokenExpiration}
        );
    }
    verify(token: string): UserPayload{
        try {
            return jwt.verify(token, this.secretKey) as UserPayload;
        } catch (error) {
            logger.error(`Token verification failed: ${error}`);
            if(error instanceof jwt.JsonWebTokenError){
                throw new InvalidTokenException();
            }
            if(error instanceof jwt.TokenExpiredError){
                throw new TokenExpiredException();
            }
            throw new ServiceException("Token verification failed");
        } 
    }
    refreshToken(refreshToken: string){
        const payLoad = this.verify(refreshToken);
        if(!payLoad){
            throw new InvalidTokenException();
        }
        return this.generateToken(payLoad);
    }
    setTokenIntoCookie(res: Response,token: string){
        res.cookie("token",token,{
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.tokenExpiration)
        })
    }
    setRefreshTokenIntoCookie(res: Response,token: string){
        res.cookie("refreshToken",token,{
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.refreshTokenExpiration)
        })
    }
    clearTokens(res: Response){
        res.clearCookie("token");
        res.clearCookie("refreshToken");
    }
    persistAuthentication(res: Response,payload: UserPayload){
        const token = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        // set token into cookie
        this.setTokenIntoCookie(res,token);
        // set refresh token into cookie
        this.setRefreshTokenIntoCookie(res,refreshToken);
    }
}
