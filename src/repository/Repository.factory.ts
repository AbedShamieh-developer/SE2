import { OrderRepository } from "./sqlite/Order.repository";
import { IdentifiableOrderItem, ItemCategory } from "../model/IItem.model";
import { CakeRepository } from "./sqlite/Cake.repository";
import { IRepository } from "./IRepository";
import { DBMode } from "../config/types";

export class RepositoryFactory {
  static createOrderRepository(mode: DBMode, category: ItemCategory): IRepository<IdentifiableOrderItem> {
    const logger = require("../util/logger").default;
    switch (mode) {
      case DBMode.SQLITE:
        logger.info("Creating SQLite Order Repository");
        switch (category) {
          case ItemCategory.CAKE:
            return new OrderRepository(new CakeRepository());
          default:
            throw new Error("Invalid item category");
        }
      case DBMode.FILE:
        throw new Error("File-based repository is depricated and not supported");
    }
  }
}
