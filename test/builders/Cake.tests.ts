import { CakeBuilder } from "../../src/model/builders/Cake.builder"

describe("CakeBuilder", () => {
    const createValidBuilder = () =>
        new CakeBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")
            .setFilling("Vanilla Cream")
            .setSize(8)
            .setLayers(2)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Chocolate")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Blue")
            .setCustomMessage("Happy Birthday")
            .setShape("Round")
            .setAllergies("Milk")
            .setSpecialIngredients("Strawberries")
            .setPackagingType("Box")

    it("builds a cake when all required properties are set", () => {
        const cake = createValidBuilder().build()

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

    it("throws when a text setter receives an empty value", () => {
        const builder = new CakeBuilder()

        expect(() => builder.setType("")).toThrow("type is required")
    })

    it("throws when a number setter receives 0", () => {
        const builder = new CakeBuilder()

        expect(() => builder.setSize(0)).toThrow("size must be greater than 0")
    })

    it("throws when build is called before all properties are set", () => {
        const builder = new CakeBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")

        expect(() => builder.build()).toThrow("All cake properties are required")
    })
})
