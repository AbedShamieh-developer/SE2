import { ID } from "../repository/IRepository";
import { IOrder } from "./IOrder.model";

export interface IItem {
    getCategory(): ItemCategory
}
export interface IdentifiableItem extends IItem, ID{
    
} 
export interface IdentifiableOrderItem extends ID, IOrder {
    getItem(): IdentifiableItem
}
export enum ItemCategory{
    CAKE = "cake",
    BOOK = "book",
    TOY = "toy"
}
