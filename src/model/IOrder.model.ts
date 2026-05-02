import { IItem } from "./IItem.model";

export interface IOrder {
    getItem(): IItem;
    getPrice(): number;
    getQuantity(): number;
    getId(): string;
}