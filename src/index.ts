import { CSVCakeMapper } from "./mappers/Cake.mapper";
import { CSVOrderMapper } from "./mappers/Order.mapper";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import { CSVParser } from "./util/parser";
import logger from "./util/logger";
import {open} from "sqlite"
import  {Database}  from "sqlite3";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { Initializable, InitializeRepository, IRepository } from "./repository/IRepository";
import { IOrder } from "./model/IOrder.model";
// import { CakeRepository } from "./repository/sqlite/Cake.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/Cake.builder";
import { Cake } from "./model/Cake.model";
import { IdentifiableOrderBuilder, OrderBuilder } from "./model/builders/Order.builder";
import { CakeRepository } from "./repository/sqlite/Cake.repository";
import { log } from "winston";
import { DBMode, RepositoryFactory } from "./repository/Repository.factory";
import { ItemCategory } from "./model/IItem.model";
import { ConnectionManager } from "./repository/sqlite/ConnectionManager";
const TEST_OUTPUT_FILE = "src/data/cake orders.test-output.csv";
const CAKE_ORDER_HEADERS = [
    "id",
    "Type",
    "Flavor",
    "Filling",
    "Size",
    "Layers",
    "Frosting Type",
    "Frosting Flavor",
    "Decoration Type",
    "Decoration Color",
    "Custom Message",
    "Shape",
    "Allergies",
    "Special Ingredients",
    "Packaging Type",
    "Price",
    "Quantity"
];

async function main() {
    const repository = new RepositoryFactory()
    const cakeRepo = repository.create(DBMode.SQLITE, ItemCategory.CAKE)
    ConnectionManager.getConnection();
    cakeRepo.create()
}

main().catch((error) => logger.error(error));
