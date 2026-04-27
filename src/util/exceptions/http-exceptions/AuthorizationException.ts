import { HTTPException } from "./HTTPExceptions";

export class AuthorizationException extends HTTPException{
    constructor(message: string = "Unauthorized") {
        super(403,message);
        this.name = "AuthorizationException";
    }
}
export class InvalidRoleException extends AuthorizationException{
    constructor(role: string) {
        super("Invalid role: " + role);
        this.name = "InvalidRoleException";
    }
}
export class InsufficientException extends AuthorizationException{
    constructor() {
        super("Insufficient Permissions");
        this.name = "InvalidRoleException";
    }
}