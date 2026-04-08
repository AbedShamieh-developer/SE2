import { CSVCakeMapper } from "../../src/mappers/Cake.mapper"

describe("CSVCakeMapper", () => {
    const createValidRow = (): string[] => [
        "123",
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
        "25",
        "3"
    ]

    it("maps a CSV row into a Cake", () => {
        const mapper = new CSVCakeMapper()

        const cake = mapper.map(createValidRow())

        expect(cake.getType()).toBe("Birthday")
        expect(cake.getFlavor()).toBe("Chocolate")
        expect(cake.getFilling()).toBe("Vanilla Cream")
        expect(cake.getSize()).toBe(8)
        expect(cake.getLayers()).toBe(2)
        expect(cake.getFrostingType()).toBe("Buttercream")
        expect(cake.getFrostingFlavor()).toBe("Chocolate")
        expect(cake.getDecorationType()).toBe("Sprinkles")
        expect(cake.getDecorationColor()).toBe("Blue")
        expect(cake.getCustomMessage()).toBe("Happy Birthday")
        expect(cake.getShape()).toBe("Round")
        expect(cake.getAllergies()).toBe("Milk")
        expect(cake.getSpecialIngredients()).toBe("Strawberries")
        expect(cake.getPackagingType()).toBe("Box")
    })

    it("uses a default custom message when CSV custom message is empty", () => {
        const mapper = new CSVCakeMapper()
        const row = createValidRow()
        row[10] = ""

        const cake = mapper.map(row)

        expect(cake.getCustomMessage()).toBe("No message")
    })

    it("throws when numeric CSV values are invalid", () => {
        const mapper = new CSVCakeMapper()
        const row = createValidRow()
        row[4] = "0"

        expect(() => mapper.map(row)).toThrow("size must be greater than 0")
    })
})
