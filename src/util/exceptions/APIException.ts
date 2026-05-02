export class APIException extends Error {
    constructor(public status: number,message: string){
        super(message);
        this.name = "APIException";
        this.status = status;
    }
}