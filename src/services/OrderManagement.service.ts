import { generateUuid } from "../util";
import { RepositoryFactory } from "../repository/Repository.factory";
import config from "../config";
import { IdentifiableOrderItem, ItemCategory } from "../model/IItem.model";
import { ItemNotFoundException } from "../util/exceptions/repositoryExceptions";
import { NotFoundException } from "../util/exceptions/http-exceptions/NotFoundException";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";

export class OrderManagementService {
    // create order
    async createOrder(order: IdentifiableOrderItem): Promise<IdentifiableOrderItem> {
        this.validateOrder(order);
        // assign an id
        const id = generateUuid("order");
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.create(order);
        return order;
    }
    // get order
    async getOrder(id: string): Promise<IdentifiableOrderItem> {
        const categories = this.getSupportedCategories()
        for(const category of categories){
            try {
            const repo = await this.getRepo(category);
            const order = await repo.get({getId: () => id});
            return order;
            } catch (error) {
                continue;
            }
        }
        throw new NotFoundException("Order Not Found")
    }
    // update order
    async updateOrder(order: IdentifiableOrderItem): Promise<void> {
        this.validateOrder(order);
        const categories = this.getSupportedCategories()
        for(const category of categories){
            const repo = await this.getRepo(category);
            try{
                await repo.update(order);
                return;
            }catch(error){
                continue;
            }
        }
        throw new NotFoundException("Order Not Found")
    }
    // delete order
    async deleteOrder(id: string): Promise<void> {
        const categories = this.getSupportedCategories()
        for(const category of categories){
            const repo = await this.getRepo(category);
            try{
                await repo.delete({getId: () => id});
                return;
            }catch(error){
                // ignore error and try next category
                continue;
            }
        }
        throw new ItemNotFoundException("Order Not Found")
    }

    // get all orders
    async getAllOrders(): Promise<IdentifiableOrderItem[]> {
        const categories = this.getSupportedCategories()
        let allOrders: IdentifiableOrderItem[] = [];
        for(const category of categories){
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders = allOrders.concat(orders);
        }
        return allOrders;
    }

    private getRepo(category: ItemCategory){
        return RepositoryFactory.createOrderRepository(config.dbMode, category);
    }
    private validateOrder(order: IdentifiableOrderItem){
        if(!order.getItem() || !order.getPrice() || !order.getQuantity()){
            const details = {
                    ItemNotDefined: !order.getItem(),
                    PriceNotDefined: !order.getPrice(),
                    QuantityNotDefined: !order.getQuantity()
                }
            throw new BadRequestException(
                "Invalid Order, item is "+details.ItemNotDefined+", price is "+details.PriceNotDefined+", quantity is "+details.QuantityNotDefined,  
                details
            );
        }
    }
    private getSupportedCategories(): ItemCategory[] {
        return [ItemCategory.CAKE];
    }
    // get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.reduce((total, order) => total + order.getPrice() * order.getQuantity(), 0);
    }
    // get total orders
    public async getTotalOrders(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.length;
    }
    
}
