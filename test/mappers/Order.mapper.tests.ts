import { CSVOrderMapper } from "../../src/mappers/Order.mapper"
import { IMapper } from "../../src/mappers/IMapper"
import { IItem, ItemCategory } from "../../src/model/IItem.model"

class FakeItem implements IItem {
    getCategory(): ItemCategory {
        return ItemCategory.CAKE
    }
}

describe("CSVOrderMapper", () => {
    const createValidRow = (): string[] => [
        "42",
        "Birthday",
        "Chocolate",
        "Vanilla Cream",
        "8",
        "2",
        "Buttercream",
        "Chocolate",
        "Sprinkles",
        "Blue",
        "Happy Birthday",
        "Round",
        "Milk",
        "Strawberries",
        "Box",
        "50",
        "3"
    ]

    it("maps CSV row into an Order using the injected item mapper", () => {
        const fakeItem = new FakeItem()
        const itemMapper: IMapper<string[], IItem> = {
            map: jest.fn().mockReturnValue(fakeItem)
        }
        const orderMapper = new CSVOrderMapper(itemMapper)

        const row = createValidRow()
        const order = orderMapper.map(row)

        expect(itemMapper.map).toHaveBeenCalledWith(row)
        expect(order.getItem()).toBe(fakeItem)
        expect(order.getId()).toBe("42")
        expect(order.getPrice()).toBe(50)
        expect(order.getQuantity()).toBe(3)
    })

    it("throws when id is empty", () => {
        const itemMapper: IMapper<string[], IItem> = {
            map: jest.fn().mockReturnValue(new FakeItem())
        }
        const orderMapper = new CSVOrderMapper(itemMapper)
        const row = createValidRow()
        row[0] = "   "

        expect(() => orderMapper.map(row)).toThrow("id is required")
    })

    it("throws when parsed price is not a valid positive number", () => {
        const itemMapper: IMapper<string[], IItem> = {
            map: jest.fn().mockReturnValue(new FakeItem())
        }
        const orderMapper = new CSVOrderMapper(itemMapper)
        const row = createValidRow()
        row[row.length - 2] = "abc"

        expect(() => orderMapper.map(row)).toThrow("All order properties are required")
    })
})
