import { IdentifiableItem, IItem } from "../IItem.model"
import { IOrder } from "../IOrder.model"
import { IdentifiableOrder, Order } from "../Order"

export class OrderBuilder {
    private item!: IItem
    private price!: number
    private quantity!: number
    private id!: string

    private validateRequiredItem(value: IItem): IItem {
        if (!value) {
            throw new Error("item is required")
        }

        return value
    }

    private validateRequiredText(value: string, fieldName: string): string {
        if (!value || !value.trim()) {
            throw new Error(`${fieldName} is required`)
        }

        return value.trim()
    }

    private validateRequiredNumber(value: number, fieldName: string): number {
        if (value <= 0) {
            throw new Error(`${fieldName} must be greater than 0`)
        }

        return value
    }

    setItem(item: IItem): this {
        this.item = this.validateRequiredItem(item)
        return this
    }

    setPrice(price: number): this {
        this.price = this.validateRequiredNumber(price, "price")
        return this
    }

    setQuantity(quantity: number): this {
        this.quantity = this.validateRequiredNumber(quantity, "quantity")
        return this
    }

    setId(id: string): this {
        this.id = this.validateRequiredText(id, "id")
        return this
    }

    static newOrderBuilder() {
        return new OrderBuilder()
    }

    build(): Order {
        const requiredProperties = [
            this.item,
            this.price,
            this.quantity,
            this.id
        ]

        for (const property of requiredProperties) {
            if (!property) {
                throw new Error("All order properties are required")
            }
        }

        return new Order(this.item, this.price, this.quantity, this.id)
    }
}
export class IdentifiableOrderBuilder {
    static newIdentifiableOrderBuilder() {
        return new IdentifiableOrderBuilder()
    }
    private identifiableItem!: IdentifiableItem
    private price!: number
    private quantity!: number
    private id!: string

    setItem(identifiableItem: IdentifiableItem): this {
        this.identifiableItem = identifiableItem
        return this
    }

    setPrice(price: number): this {
        this.price = price
        return this
    }

    setQuantity(quantity: number): this {
        this.quantity = quantity
        return this
    }

    setId(id: string): this {
        this.id = id
        return this
    }
    build(): IdentifiableOrder {
        const requiredProperties = [
            this.identifiableItem,
            this.price,
            this.quantity,
            this.id
        ]
        for (const property of requiredProperties) {
            if (!property) {
                throw new Error("All order properties are required")
            }
        }

        return new IdentifiableOrder(this.identifiableItem, this.price, this.quantity, this.id)
    }
}