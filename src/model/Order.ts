import { IItem } from "./IItem.model";
import { IOrder } from "./IOrder.model";

export class Order implements IOrder {
    constructor(private item: IItem,private price: number,private quantity: number,private id: string){}
    getItem(): IItem {
        return this.item
    }
    getPrice(): number {
        return this.price
    }
    getQuantity(): number {
        return this.quantity
    }
    getId(): string {
        return this.id
    }
    
}