export class HTTPException extends Error{
    constructor(
        public status: number,
        public message: string, 
        public readonly details?: Record<string,any>
        ) {
        super(message);
        this.name = "HttpException";
    }

}