import { Cake, IdentifiableCake } from "../Cake.model"

export class CakeBuilder {
    private type!: string
    private flavor!: string
    private filling!: string
    private size!: number
    private layers!: number
    private frostingType!: string
    private frostingFlavor!: string
    private decorationType!: string
    private decorationColor!: string
    private customMessage!: string
    private shape!: string
    private allergies!: string
    private specialIngredients!: string
    private packagingType!: string

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

    setType(type: string): this {
        this.type = this.validateRequiredText(type, "type")
        return this
    }

    setFlavor(flavor: string): this {
        this.flavor = this.validateRequiredText(flavor, "flavor")
        return this
    }

    setFilling(filling: string): this {
        this.filling = this.validateRequiredText(filling, "filling")
        return this
    }

    setSize(size: number): this {
        this.size = this.validateRequiredNumber(size, "size")
        return this
    }

    setLayers(layers: number): this {
        this.layers = this.validateRequiredNumber(layers, "layers")
        return this
    }

    setFrostingType(frostingType: string): this {
        this.frostingType = this.validateRequiredText(frostingType, "frostingType")
        return this
    }

    setFrostingFlavor(frostingFlavor: string): this {
        this.frostingFlavor = this.validateRequiredText(frostingFlavor, "frostingFlavor")
        return this
    }

    setDecorationType(decorationType: string): this {
        this.decorationType = this.validateRequiredText(decorationType, "decorationType")
        return this
    }

    setDecorationColor(decorationColor: string): this {
        this.decorationColor = this.validateRequiredText(decorationColor, "decorationColor")
        return this
    }

    setCustomMessage(customMessage: string): this {
        this.customMessage = this.validateRequiredText(customMessage, "customMessage")
        return this
    }

    setShape(shape: string): this {
        this.shape = this.validateRequiredText(shape, "shape")
        return this
    }

    setAllergies(allergies: string): this {
        this.allergies = this.validateRequiredText(allergies, "allergies")
        return this
    }

    setSpecialIngredients(specialIngredients: string): this {
        this.specialIngredients = this.validateRequiredText(specialIngredients, "specialIngredients")
        return this
    }

    setPackagingType(packagingType: string): this {
        this.packagingType = this.validateRequiredText(packagingType, "packagingType")
        return this
    }
    static newCakeBuilder(){
        return new CakeBuilder();
    }

    build(): Cake {
        const requiredProperties = [
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        ]

        for (const property of requiredProperties) {
            if (!property) {
                throw new Error("All cake properties are required")
            }
        }

        return new Cake(
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        )
    }
}
export class IdentifiableCakeBuilder {
    private id!: string
    private cake!: Cake

    setId(id: string): IdentifiableCakeBuilder {
        if (!id || !id.trim()) {
            throw new Error("id is required")
        }
        this.id = id.trim()
        return this
    }
    setCake(cake: Cake): IdentifiableCakeBuilder {
        if (!cake) {
            throw new Error("cake is required")
        }
        this.cake = cake
        return this
    }
    static newIdentifiableCakeBuilder(){
        return new IdentifiableCakeBuilder();
    }
    build(): IdentifiableCake {
        if (!this.id) {
            throw new Error("id is required")
        }
        if (!this.cake) {
            throw new Error("cake is required")
        }
        return new IdentifiableCake(
            this.id,
            this.cake.getType(),
            this.cake.getFlavor(),
            this.cake.getFilling(),
            this.cake.getSize(),
            this.cake.getLayers(),
            this.cake.getFrostingType(),
            this.cake.getFrostingFlavor(),
            this.cake.getDecorationType(),
            this.cake.getDecorationColor(),
            this.cake.getCustomMessage(),
            this.cake.getShape(),
            this.cake.getAllergies(),
            this.cake.getSpecialIngredients(),
            this.cake.getPackagingType()
        )
    }

}
