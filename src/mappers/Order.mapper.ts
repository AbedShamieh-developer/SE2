import { OrderBuilder } from "../model/builders/Order.builder";
import { IItem } from "../model/IItem.model";
import { Order } from "../model/Order";
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
    
}