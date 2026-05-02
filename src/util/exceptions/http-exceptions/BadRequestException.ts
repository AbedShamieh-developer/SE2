import { HTTPException } from "./HTTPExceptions";

export class BadRequestException extends HTTPException {
    constructor(message: string = "Bad Request", details?: Record<string,any>){
        super(400,message,details);
        this.name = "BadRequestException";
    }
}