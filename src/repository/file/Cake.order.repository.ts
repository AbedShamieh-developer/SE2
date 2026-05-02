import { Order } from "../../model/Order";
import { CSVCakeMapper } from "../../mappers/Cake.mapper";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { CSVParser, IParser } from "../../util/parser";
import { OrderRepository } from "./Order.repository";
import { IOrder } from "../../model/IOrder.model";

const CAKE_ORDER_FILE_PATH = "src/data/cake orders.csv"
const CAKE_ORDER_HEADERS = [
    "id",
    "Type",
    "Flavor",
    "Filling",
    "Size",
    "Layers",
    "Frosting Type",
    "Frosting Flavor",
    "Decoration Type",
    "Decoration Color",
    "Custom Message",
    "Shape",
    "Allergies",
    "Special Ingredients",
    "Packaging Type",
    "Price",
    "Quantity"
]

export class CakeOrderRepository extends OrderRepository {
    constructor(private parser: IParser){
        super()
    }
    protected async load(): Promise<IOrder[]> {
        const csvRows = await this.parser.parseRows(CAKE_ORDER_FILE_PATH, { skipHeader: true })
        const orderMapper = new CSVOrderMapper(new CSVCakeMapper())
        const orders: IOrder[] = csvRows.map(row => orderMapper.map(row))
        return orders;
    }

    protected async save(orders: Order[]): Promise<void> {
        const orderMapper = new CSVOrderMapper(new CSVCakeMapper())
        const rows = orders.map(order => orderMapper.reverseMap(order))

        await this.parser.writeRows(CAKE_ORDER_FILE_PATH, rows, { header: CAKE_ORDER_HEADERS })
    }
    
}
