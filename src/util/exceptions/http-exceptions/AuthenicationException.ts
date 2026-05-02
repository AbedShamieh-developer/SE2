import { HTTPException } from "./HTTPExceptions";

export class AuthenitactionException extends HTTPException{
    constructor(message: string = "Unauthorized") {
        super(401,message);
        this.name = "AuthenitactionException";
    }
}
export class InvalidTokenException extends AuthenitactionException{
    constructor() {
        super("Invalid Token");
        this.name = "InvalidTokenException";
    }
}
export class TokenExpiredException extends AuthenitactionException{
    constructor() {
        super("Token Expired");
        this.name = "TokenExpiredException";
    }
}
export class AuthenticationFailedException extends AuthenitactionException{
    constructor() {
        super("Authentication Failed");
        this.name = "AuthenticationFailedException";
    }
}