import { IdentifiableOrderBuilder, OrderBuilder } from "../model/builders/Order.builder";
import { IdentifiableItem, IdentifiableOrderItem, IItem } from "../model/IItem.model";
import { IOrder } from "../model/IOrder.model";
import { IdentifiableOrder, Order } from "../model/Order";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[],Order> {
    constructor(private itemMapper: IMapper<string[],IItem>){}
    map(data: string[]): Order {
        const item: IItem = this.itemMapper.map(data)
        return OrderBuilder.newOrderBuilder()
                            .setId(data[0])
                             .setPrice(parseInt(data[data.length - 2]))
                             .setQuantity(parseInt(data[data.length -1]))
                             .setItem(item)
                             .build()
    }

    reverseMap(data: IOrder): string[] {
        if (!this.itemMapper.reverseMap) {
            throw new Error("Reverse mapping is not implemented for the injected item mapper")
        }

        const row = this.itemMapper.reverseMap(data.getItem())
        row[0] = data.getId()
        row[15] = String(data.getPrice())
        row[16] = String(data.getQuantity())

        return row
    }
}
export interface SQLiteOrder {
    id: string;
    price: number;
    quantity: number;
    item_category: string;
    item_id: string;
}
export class SQLiteOrderMapper implements IMapper<{data: SQLiteOrder, item: IdentifiableItem},IdentifiableOrderItem> {

    map({data,item}: {data: SQLiteOrder, item: IdentifiableItem}): IdentifiableOrderItem {
        return IdentifiableOrderBuilder.newIdentifiableOrderBuilder()
            .setItem(item).setId(String(data.id)).setPrice(data.price).setQuantity(data.quantity)
            .build()
    }
    reverseMap(data: IdentifiableOrderItem): { data: SQLiteOrder; item: IdentifiableItem; } {
        return {
            data: {
                id: data.getId(),
                price: data.getPrice(),
                quantity: data.getQuantity(),
                item_category: data.getItem().getCategory(),
                item_id: data.getItem().getId()
            },
            item: data.getItem()
        }
    }
    
}
export class JSONRequestMapper implements IMapper<any, IdentifiableOrderItem>{
    constructor(private itemMapper: IMapper<any,IdentifiableItem>){}
    map(data: any): IdentifiableOrderItem {
        const itemPayload = data?.item ?? data?.identifiableItem
        const item = this.itemMapper.map(itemPayload)
        return IdentifiableOrderBuilder.newIdentifiableOrderBuilder()
        .setId(String(data?.id ?? data?.orderId ?? ""))
        .setItem(item)
        .setPrice(Number(data?.price))
        .setQuantity(Number(data?.quantity))
        .build()
    }
    reverseMap(data: IdentifiableOrderItem) {
        return {
            id: data.getId(),
            item: this.itemMapper.reverseMap(data.getItem()),
            price: data.getPrice(),
            quantity: data.getQuantity()
        }
    }
    
}
