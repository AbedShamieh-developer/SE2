import { HTTPException } from "./HTTPExceptions";

export class NotFoundException extends HTTPException {
    constructor(message: string = "Not Found",details?: Record<string,any>) {
        super(404,message);
        this.name = "NotFoundException";
    }

}