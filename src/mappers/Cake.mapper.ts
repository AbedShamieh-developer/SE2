import { CakeBuilder } from "../model/builders/Cake.builder";
import { Cake } from "../model/Cake.model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<string[], Cake> {
    map(data: string[]): Cake {
        const customMessage = data[10]?.trim() ? data[10] : "No message"
        return CakeBuilder
            .newCakeBuilder()
            .setType(data[1])
            .setFlavor(data[2])
            .setFilling(data[3])
            .setSize(Number(data[4]))
            .setLayers(Number(data[5]))
            .setFrostingType(data[6])
            .setFrostingFlavor(data[7])
            .setDecorationType(data[8])
            .setDecorationColor(data[9])
            .setCustomMessage(customMessage)
            .setShape(data[11])
            .setAllergies(data[12])
            .setSpecialIngredients(data[13])
            .setPackagingType(data[14])
            .build()
    }
}
