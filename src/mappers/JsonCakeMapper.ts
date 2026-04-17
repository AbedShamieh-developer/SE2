import { CakeBuilder } from "../model/builders/Cake.builder"
import { Cake } from "../model/Cake.model"
import { IMapper } from "./IMapper"

export interface CakeJsonRow {
  id: number
  Type: string
  Flavor: string
  Filling: string
  Size: number
  Layers: number
  "Frosting Type": string
  "Frosting Flavor": string
  "Decoration Type": string
  "Decoration Color": string
  "Custom Message": string
  Shape: string
  Allergies: string
  "Special Ingredients": string
  "Packaging Type": string
  Price: number
  Quantity: number
}
export class JsonCakeMapper implements IMapper<CakeJsonRow,Cake>{
    map(data: CakeJsonRow):Cake{
        const customMessage = data["Custom Message"]?.trim() ? data["Custom Message"] : "No message"

        return CakeBuilder.newCakeBuilder()
                        .setType(data.Type)
                        .setFlavor(data.Flavor)
                        .setFilling(data.Filling)
                        .setSize(Number(data.Size))
                        .setLayers(Number(data.Layers))
                        .setFrostingType(data["Frosting Type"])
                        .setFrostingFlavor(data["Frosting Flavor"])
                        .setDecorationType(data["Decoration Type"])
                        .setDecorationColor(data["Decoration Color"])
                        .setCustomMessage(customMessage)
                        .setShape(data.Shape)
                        .setAllergies(data.Allergies)
                        .setSpecialIngredients(data["Special Ingredients"])
                        .setPackagingType(data["Packaging Type"])
                        .build()
    }

    reverseMap(data: Cake): CakeJsonRow {
        return {
            id: 0,
            Type: data.getType(),
            Flavor: data.getFlavor(),
            Filling: data.getFilling(),
            Size: data.getSize(),
            Layers: data.getLayers(),
            "Frosting Type": data.getFrostingType(),
            "Frosting Flavor": data.getFrostingFlavor(),
            "Decoration Type": data.getDecorationType(),
            "Decoration Color": data.getDecorationColor(),
            "Custom Message": data.getCustomMessage() === "No message" ? "" : data.getCustomMessage(),
            Shape: data.getShape(),
            Allergies: data.getAllergies(),
            "Special Ingredients": data.getSpecialIngredients(),
            "Packaging Type": data.getPackagingType(),
            Price: 0,
            Quantity: 0
        }
    }
}
    
