export class ItemNotFoundException extends Error {
    constructor(message: string){
        super(message)
        this.name = "ItemNotFoundException"
    }
}
export class InvalidItemException extends Error {
    constructor(message: string){
        super(message)
        this.name = "InvalidItemException"
    }
}
export class RepositoryException extends Error {
    constructor(message: string){
        super(message)
        this.name = "RepositoryException"
    }
}
export class InitializationException extends Error {
    constructor(message: string){
        super(message)
        this.name = "InitializationException"
    }
}
export class DatabaseConnectionException extends Error {
    constructor(message: string){
        super(message)
        this.name = "DatabaseConnectionException"
    } 
}  