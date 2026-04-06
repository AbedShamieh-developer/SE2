import { Item, ItemCategory } from "./Item.model";

export class Cake implements Item {
    constructor(
        public type: string,
        public flavor: string,
        public filling: string,
        public size: number,
        public layers: number,
        public frostingType: string,
        public frostingFlavor: string,
        public decorationType: string,
        public decorationColor: string,
        public customMessage: string,
        public shape: string,
        public allergies: string,
        public specialIngredients: string,
        public packagingType: string
    ) {}

    getType(): string {
        return this.type;
    }

    getFlavor(): string {
        return this.flavor;
    }

    getFilling(): string {
        return this.filling;
    }

    getSize(): number {
        return this.size;
    }

    getLayers(): number {
        return this.layers;
    }

    getFrostingType(): string {
        return this.frostingType;
    }

    getFrostingFlavor(): string {
        return this.frostingFlavor;
    }

    getDecorationType(): string {
        return this.decorationType;
    }

    getDecorationColor(): string {
        return this.decorationColor;
    }

    getCustomMessage(): string {
        return this.customMessage;
    }

    getShape(): string {
        return this.shape;
    }

    getAllergies(): string {
        return this.allergies;
    }

    getSpecialIngredients(): string {
        return this.specialIngredients;
    }

    getPackagingType(): string {
        return this.packagingType;
    }

    getCategory(): ItemCategory {
        return ItemCategory.CAKE;
    }
}
