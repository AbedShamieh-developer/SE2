import { OrderRepository } from "./sqlite/Order.repository";
import { ItemCategory } from "../model/IItem.model";
import { CakeRepository } from "./sqlite/Cake.repository";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import { CSVParser } from "../util/parser";
import { Initializable, IRepository } from "./IRepository";
import { IOrder } from "../model/IOrder.model";
import logger from "../util/logger";

export enum DBMode {
  SQLITE = "sqlite",
  FILE = "file",
}

/**
 * Abstract factory that defines the interface for creating repositories
 */
export interface IRepositoryFactory {
  createRepository(category: ItemCategory): IRepository<IOrder>;
}

/**
 * Concrete factory for SQLite-based repositories
 */
export class SQLiteRepositoryFactory implements IRepositoryFactory {
  createRepository(category: ItemCategory): IRepository<IOrder> {
    let repository: IRepository<IOrder> & Initializable;
    
    switch (category) {
      case ItemCategory.CAKE:
        repository = new OrderRepository(new CakeRepository());
        logger.info(`Created SQLite repository for category ${category}`);
        break;
      default:
        throw new Error(
          `No SQLite repository found for category ${category}`,
        );
    }
    
    repository.init();
    return repository;
  }
}

/**
 * Concrete factory for File-based repositories
 */
export class FileRepositoryFactory implements IRepositoryFactory {
  createRepository(category: ItemCategory): IRepository<IOrder> {
    switch (category) {
      case ItemCategory.CAKE:
        logger.info(`Created file repository for category ${category}`);
        return new CakeOrderRepository(new CSVParser());
      default:
        throw new Error(
          `No file repository found for category ${category}`,
        );
    }
  }
}

/**
 * Factory of factories - manages concrete factory instantiation
 */
export class RepositoryFactory {
  private factories: Map<DBMode, IRepositoryFactory>;

  constructor() {
    this.factories = new Map([
      [DBMode.SQLITE, new SQLiteRepositoryFactory()],
      [DBMode.FILE, new FileRepositoryFactory()],
    ]);
  }

  create(mode: DBMode, category: ItemCategory): IRepository<IOrder> {
    const factory = this.factories.get(mode);
    
    if (!factory) {
      throw new Error(`Unsupported database mode: ${mode}`);
    }
    logger.info(`Using ${mode} repository factory for category ${category}`);
    return factory.createRepository(category);
  }

  /**
   * Register a custom factory for extension purposes
   */
  registerFactory(mode: DBMode, factory: IRepositoryFactory): void {
    this.factories.set(mode, factory);
  }
}
