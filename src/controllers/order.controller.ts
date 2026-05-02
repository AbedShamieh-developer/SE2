import { Response, Request } from "express";
import { OrderManagementService } from "../services/OrderManagement.service";
import { IdentifiableOrderItem, ItemCategory } from "../model/IItem.model";
import { JsonMapperFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/http-exceptions/BadRequestException";

export class OrderController {
    constructor(private orderService: OrderManagementService){}
    // create order
    async createOrder(req: Request,res: Response){
            const order: IdentifiableOrderItem = JsonMapperFactory.createMapper(ItemCategory.CAKE).map(req.body);
            if(!order){
                throw new BadRequestException("Order not created",{OrderNotDefined: !order});
            }
            const createdOrder = await this.orderService.createOrder(order);
            res.status(201).json({createdOrder});
        }
       
    // get order
    async getOrder(req: Request,res: Response){
        const id = req.params.id as string;
        if(!id){
            throw new BadRequestException("Id is required",{IdNotDefined: !id});
        }
            const order = await this.orderService.getOrder(id);
            res.status(200).json(order);
    }
    async getAllOrders(req: Request,res: Response){
            const orders = await this.orderService.getAllOrders();
            if(!orders){
                throw new BadRequestException("Orders not found",{OrdersNotDefined: !orders});
            }
            res.status(200).json(orders);
    }
    async updateOrder(req: Request,res: Response){
        const id = req.params.id as string;
        if(!id){
            throw new BadRequestException("Id is required",{IdNotDefined: !id});
        }
        const payload = req.body ?? {};
        const itemPayload = payload.item ?? payload.identifiableItem;
        const category = payload.category ?? itemPayload?.category ?? ItemCategory.CAKE;
        const normalizedPayload = { ...payload, item: itemPayload };

        const order: IdentifiableOrderItem = JsonMapperFactory.createMapper(category).map(normalizedPayload);
        if(!order){
            throw new BadRequestException("Order not created",{OrderNotDefined: !order});
        }
        if(order.getId() !== id){
            throw new BadRequestException("Order id does not match",{OrderIdDoesNotMatch: order.getId() !== id});
        }
            await this.orderService.updateOrder(order);
            res.status(200).json({status: "Order Updated Successfully"});

        }
    async deleteOrder(req: Request,res: Response){
        const id = req.params.id as string;
        if(!id){
            throw new BadRequestException("Id is required",{IdNotDefined: !id});
        }
            await this.orderService.deleteOrder(id);
            res.status(200).json({status: "Order Deleted Successfully"});
    }
    async getTotalRevenue(req: Request,res: Response){
        const totalRevenue = await this.orderService.getTotalRevenue();
        res.status(200).json({totalRevenue: totalRevenue});
    }
    async getTotalOrders(req: Request,res: Response){
        const totalOrders = await this.orderService.getTotalOrders();
        res.status(200).json({totalOrders: totalOrders});
    }
}
