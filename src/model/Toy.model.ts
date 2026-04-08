import { IItem, ItemCategory } from "./IItem.model";

export class Toy implements IItem{
    constructor(
        private name: string,
        private brand: string,
        private type: string,
        private material: string,
        private color: string,
        private ageGroup: string,
        private batteryRequired: boolean,
        private size: string
    ) {}

    getName(): string {
        return this.name;
    }

    getBrand(): string {
        return this.brand;
    }

    getType(): string {
        return this.type;
    }

    getMaterial(): string {
        return this.material;
    }

    getColor(): string {
        return this.color;
    }

    getAgeGroup(): string {
        return this.ageGroup;
    }

    getBatteryRequired(): boolean {
        return this.batteryRequired;
    }

    getSize(): string {
        return this.size;
    }

    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }
}
