import { Toy } from "../Toy.model"

export class ToyBuilder {
    private name!: string
    private brand!: string
    private type!: string
    private material!: string
    private color!: string
    private ageGroup!: string
    private batteryRequired!: boolean
    private size!: string

    private validateRequiredText(value: string, fieldName: string): string {
        if (!value || !value.trim()) {
            throw new Error(`${fieldName} is required`)
        }

        return value.trim()
    }

    setName(name: string): this {
        this.name = this.validateRequiredText(name, "name")
        return this
    }

    setBrand(brand: string): this {
        this.brand = this.validateRequiredText(brand, "brand")
        return this
    }

    setType(type: string): this {
        this.type = this.validateRequiredText(type, "type")
        return this
    }

    setMaterial(material: string): this {
        this.material = this.validateRequiredText(material, "material")
        return this
    }

    setColor(color: string): this {
        this.color = this.validateRequiredText(color, "color")
        return this
    }

    setAgeGroup(ageGroup: string): this {
        this.ageGroup = this.validateRequiredText(ageGroup, "ageGroup")
        return this
    }

    setBatteryRequired(batteryRequired: boolean): this {
        this.batteryRequired = batteryRequired
        return this
    }

    setSize(size: string): this {
        this.size = this.validateRequiredText(size, "size")
        return this
    }

    build(): Toy {
        const requiredProperties = [
            this.name,
            this.brand,
            this.type,
            this.material,
            this.color,
            this.ageGroup,
            this.size
        ]

        for (const property of requiredProperties) {
            if (!property) {
                throw new Error("All toy properties are required")
            }
        }

        return new Toy(
            this.name,
            this.brand,
            this.type,
            this.material,
            this.color,
            this.ageGroup,
            this.batteryRequired,
            this.size
        )
    }
}
