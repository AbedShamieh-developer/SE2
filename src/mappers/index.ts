import { ItemCategory } from "../model/IItem.model";
import { JSONCakeMapper } from "./Cake.mapper";
import { IMapper } from "./IMapper";
import { JsonOrderMapper } from "./JsonOrderMapper";
import { JSONRequestMapper } from "./Order.mapper";

export class JsonMapperFactory{
    static createMapper(type: ItemCategory): JSONRequestMapper{
        switch(type){
            case ItemCategory.CAKE:
                return new JSONRequestMapper(new JSONCakeMapper());
            default:
                throw new Error("Invalid item category");
        }
    }
}