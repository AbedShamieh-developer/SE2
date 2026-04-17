import { ToyBuilder } from "../../src/model/builders/Toy.builder"

describe("ToyBuilder", () => {
    const createValidBuilder = () =>
        new ToyBuilder()
            .setName("Racing Car")
            .setBrand("Hot Wheels")
            .setType("Vehicle")
            .setMaterial("Plastic")
            .setColor("Red")
            .setAgeGroup("6+")
            .setBatteryRequired(true)
            .setSize("Medium")

    it("builds a toy when all required properties are set", () => {
        const toy = createValidBuilder().build()

        expect(toy.getName()).toBe("Racing Car")
        expect(toy.getBrand()).toBe("Hot Wheels")
        expect(toy.getType()).toBe("Vehicle")
        expect(toy.getMaterial()).toBe("Plastic")
        expect(toy.getColor()).toBe("Red")
        expect(toy.getAgeGroup()).toBe("6+")
        expect(toy.getBatteryRequired()).toBe(true)
        expect(toy.getSize()).toBe("Medium")
    })

    it("throws when a text setter receives an empty value", () => {
        const builder = new ToyBuilder()

        expect(() => builder.setName("   ")).toThrow("name is required")
    })

    it("allows false for batteryRequired", () => {
        const toy = createValidBuilder()
            .setBatteryRequired(false)
            .build()

        expect(toy.getBatteryRequired()).toBe(false)
    })

    it("throws when build is called before all required properties are set", () => {
        const builder = new ToyBuilder().setName("Racing Car")

        expect(() => builder.build()).toThrow("All toy properties are required")
    })
})
