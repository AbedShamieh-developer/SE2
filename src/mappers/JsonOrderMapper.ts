import { OrderBuilder } from "../model/builders/Order.builder";
import { IItem } from "../model/IItem.model";
import { Order } from "../model/Order";
import { IMapper } from "./IMapper";
import { CakeJsonRow } from "./JsonCakeMapper";

export class JsonOrderMapper implements IMapper<CakeJsonRow,Order> {
    constructor(private itemMapper: IMapper<CakeJsonRow,IItem>){}
    map(data: CakeJsonRow): Order {
        const item: IItem = this.itemMapper.map(data)
        return OrderBuilder.newOrderBuilder()
                            .setItem(item)
                            .setPrice(data.Price)
                            .setQuantity(data.Quantity)
                            .setId(String(data.id))
                            .build()
    }
}