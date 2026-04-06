export interface Order {
    id: number;
    item: string;
    price: number;
}

export class OrderManagement {
    constructor(private validator: IValidator,private calculator: ICalculator,private repository: IOrderRepository){}
    addOrder(item: string,price: number){
        let tempOrder = {item,price}
        this.validator.validate({...tempOrder,id: 0})
        this.repository.addOrder(tempOrder)
    }
    getOrder(){
        return this.repository.getOrder()
    }
    removeOrder(id: number): void {
        this.repository.removeOrder(id);
    }
    getOrderById(id: number): Order {
        return this.repository.getSpecificOrder(id);
    }
    getRevenue(): number {
        return this.calculator.getRevenue(this.repository.getOrder());
    }
    getAverageBuyPower(): number {
        return this.calculator.averageBuyPower(this.repository.getOrder());
    }
}
export interface IOrderRepository {
    getOrder(): Order[];
    addOrder(order: Omit<Order,"id">): void;
    removeOrder(id: number): void;
    getSpecificOrder(id: number): Order
}
export class OrderRepository implements IOrderRepository{
    private orders: Order[] = [];
    private static nextId = 1;
    getOrder(){
        return [...this.orders];
    }
    addOrder(order:Omit<Order,"id">): void{
        let newOrder: Order = {id:OrderRepository.nextId++,item: order.item,price: order.price}
        this.orders.push(newOrder)
    }
    removeOrder(id: number){
        this.orders.splice(this.isFoundItem(id),1)
    }
    getSpecificOrder(id: number): Order{
        return {...this.orders[this.isFoundItem(id)]};
    }
    private isFoundItem(id: number): number{
        const foundOrderIndex = this.orders.findIndex(order => order.id === id)
        if(foundOrderIndex === -1){
            throw new Error("Item not found")
        }
        return foundOrderIndex;
    }
}
export interface IValidator {
    validate(order: Order):void
}
export class Validator implements IValidator{
    private rules: IValidator[] = [new MaxPriceValidator(), new ItemNameValidator(), new ValidatePrice()];
    validate(order: Order): void {
        try{
            this.rules.forEach(v=> v.validate(order))
        }catch(error){
            throw new Error("Invalid")
        }
    }
    
}
export class MaxPriceValidator implements IValidator{
    validate(order: Order): void {
        if(order.price > 100 ){
            throw new Error("Invalid peice greater than 100")
        }
    }
}
export class ItemNameValidator implements IValidator{
   
     private static possibleItems = [
    "sponge",
    "chocolate",
    "fruit",
    "red velvet",
    "birthday",
    "carrot",
    "marble",
    "coffee",
  ];
     getPossibleItems(): string[] {
        return [...ItemNameValidator.possibleItems];
    }
    validate(order: Order): void {
        if(!ItemNameValidator.possibleItems.includes(order.item.toLowerCase()) ){
            throw new Error("Invalid item not found")
        }
    }
}
export class ValidatePrice implements IValidator{
    validate(order: Order): void {
        if(order.price <= 0){
        throw new Error("Invalid Price...Price <= 0");
        }
    }
    
}
export interface ICalculator{
    getRevenue(orders: Order[]): number
    averageBuyPower(oredr: Order[]): number
}
export class OrderCalculator implements ICalculator{
    getRevenue(orders: Order[]){
        return orders.reduce((total,order)=>total+order.price,0)
    }
    averageBuyPower(orders: Order[]){
        return orders.length === 0 ? 0 : this.getRevenue(orders) / orders.length;
    }
}
