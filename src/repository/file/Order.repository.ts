import { IOrder } from "../../model/IOrder.model";
import { Order } from "../../model/Order";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { ID, IRepository } from "../IRepository";

export abstract class OrderRepository implements IRepository<IOrder> {

      protected abstract load(): Promise<IOrder[]>
      protected abstract save(orders: IOrder[]): Promise<void>

    async create(item: IOrder): Promise<ID> {
        if(!item){
            throw new InvalidItemException("Invalid Item")
        }
        const orders = await this.load();
        const id = orders.push(item);
        await this.save(orders)
        return {getId: ()=> String(id)};
    }
    async get(id: ID): Promise<IOrder> {
        const orders = await this.load() // bring all the orders
        const foundOrder = orders.find(o => o.getId() === id.getId())
        if(!foundOrder){
            throw new ItemNotFoundException("Item not found")
        }
        return foundOrder;
    }
    async getAll(): Promise<IOrder[]> {
        const orders = await this.load()
        return orders;
    }
    async update(item: IOrder): Promise<void> {
        if(!item){
            throw new InvalidItemException("Item can't be null")
        }
        const orders = await this.load();
        const foundOrderIndex = orders.findIndex(o => o.getId() === item.getId())
        if(foundOrderIndex === -1){
            throw new ItemNotFoundException("Item not found")
        }
        orders[foundOrderIndex] = item;
        await this.save(orders);
    }
    async delete(id: ID): Promise<void> {
        const orders = await this.load() // bring all the orders
        const foundOrderIndex = orders.findIndex(o => o.getId() === id.getId())
        if(foundOrderIndex === -1){
            throw new ItemNotFoundException("Item not found")
        }
        orders.splice(foundOrderIndex,1);
        logger.info("Removed item with id: "+id.getId()+" successfully")
        await this.save(orders)
    }

}