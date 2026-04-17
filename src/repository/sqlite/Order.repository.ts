import { IOrder } from "../../model/IOrder.model";
import { ID, Initializable, IRepository } from "../IRepository";
import dotenv from "dotenv";
import { ConnectionManager } from "./ConnectionManager";
import {
  IdentifiableItem,
  IdentifiableOrderItem,
} from "../../model/IItem.model";
import logger from "../../util/logger";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";
import { Cake, IdentifiableCake } from "../../model/Cake.model";
dotenv.config();

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id INTEGER NOT NULL
)`;
const INSERT_ORDER = `INSERT INTO orders (quantity, price, item_category, item_id) VALUES (?, ?, ?, ?)`;
const SELECT_ORDER = `SELECT * FROM orders WHERE id = ?`;
const SELECT_ALL_ORDERS = `SELECT * FROM orders where item_category = ?`;
const DELETE_ID = `DELETE FROM orders WHERE id = ?`;
export class OrderRepository implements IRepository<IOrder>, Initializable {
  constructor(
    private itemRepository: IRepository<IdentifiableItem> & Partial<Initializable>
  ) {}
  async init() {
    try {
      const db = await ConnectionManager.getConnection();
      if (typeof this.itemRepository.init === "function") {
        await this.itemRepository.init();
      }
      await db.exec(CREATE_TABLE);
    } catch (error) {
      logger.error("Error initializing Order repository:", error);
    }
  }
  async create(order: IdentifiableOrderItem): Promise<ID> {
    let conn;
    try {
      conn = await ConnectionManager.getConnection();
      await conn.exec("BEGIN TRANSACTION");
      const item_id = await this.itemRepository.create(order.getItem());
      await conn.run(
        INSERT_ORDER,
        order.getQuantity(),
        order.getPrice(),
        order.getItem().getCategory(),
        item_id.getId(),
      );
      await conn.exec("COMMIT");
      return { getId: () => order.getId() };
    } catch (error) {
      if (conn) {
        await conn.exec("ROLLBACK");
      }
      console.error("Error creating order:", error);
      throw new Error("Failed to create order.");
    }
  }
  async get(id: ID): Promise<IdentifiableOrderItem> {
    try {
        const conn = await ConnectionManager.getConnection();
        const row = await conn.get<SQLiteOrder>(SELECT_ORDER, id.getId());
        if(!row){
            throw new Error(`Order with id ${id.getId()} not found.`);
        }
        const item = await this.itemRepository.get({ getId: () => row.item_id });
        logger.info(`Fetched order row: ${JSON.stringify(row)}`);
        return new SQLiteOrderMapper().map({data: row, item: item});
    } catch (error) {
        logger.error("Error fetching order:", error);
        throw new Error("Failed to fetch order.");
    }
  }
  async getAll(): Promise<IdentifiableOrderItem[]> {
    try {
      const conn = await ConnectionManager.getConnection();
      const items = await this.itemRepository.getAll();
      if(items.length === 0){
        return [];
      }
      const orders = await conn.all<SQLiteOrder[]>(SELECT_ALL_ORDERS, items[0].getCategory());
      const bindOrders = orders.map(order => {
        const item = items.find(i => i.getId() === order.item_id);
        if(!item){
          throw new Error(`Item with id ${order.item_id} not found for order ${order.id}`);
        }
        return {order,item};
      });
      const identifiableOrders = bindOrders.map(({order, item}) => new SQLiteOrderMapper().map({data: order, item}));
      return identifiableOrders;
    } catch (error) {
      logger.error("Error fetching all orders:", error);
      throw new Error("Failed to fetch all orders.");
    }
  }
  update(item: IdentifiableOrderItem): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(id: ID): Promise<void> {
        let conn;
    try {
      conn = await ConnectionManager.getConnection();
      await conn.exec("BEGIN TRANSACTION");
      await this.itemRepository.delete({getId: () => id.getId()});
      await conn.run(
        DELETE_ID,
        id.getId()
      );
      await conn.exec("COMMIT");
    } catch (error) {
      if (conn) {
        await conn.exec("ROLLBACK");
      }
      console.error("Error deleting order:", error);
      throw new Error("Failed to delete the order.");
    }
    } 
  }

