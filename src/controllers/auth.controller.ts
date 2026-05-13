import { Request, Response } from "express";
import { AuthenticationService } from "../services/Authentication.service";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";
import { UserManagementService } from "../services/UserManagement.service";

export class AuthenticationController {
    constructor(
        private authService: AuthenticationService,
        private userService: UserManagementService
    ){}

    async login(req: Request,res: Response){
        const {email,password} = req.body;
        if(!email || !password){
            throw new BadRequestException("Email and Password are required",{
                emailMissing: !email,
                passwordMissing: !password
            })
        }
        const user = await this.userService.validateUser(email,password);
        const userPayload = {userId: user.getId(),role: user.getRole()};
        this.authService.persistAuthentication(res, userPayload);
        res.status(200).json({
            message: "Login Successful",
        });
    }
    async logout(req: Request,res: Response){
        this.authService.clearTokens(res);
        res.status(200).json({
            message: "Logout Successful"
        });
    }
}
