import { IdentifiableCake } from "../../model/Cake.model";
import { ID, IRepository } from "../IRepository";
import { Initializable } from "../IRepository";
import dotenv from "dotenv";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem.model";
import logger from "../../util/logger";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";
import { ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
dotenv.config();
const tableName = ItemCategory.CAKE;
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frostingType TEXT NOT NULL,
    frostingFlavor TEXT NOT NULL,
    decorationType TEXT NOT NULL,
    decorationColor TEXT NOT NULL,
    customMessage TEXT NOT NULL,
    shape TEXT NOT NULL,
    allergies TEXT NOT NULL,
    specialIngredients TEXT NOT NULL,
    packagingType TEXT NOT NULL
)`;
const INSERT_CAKE = `INSERT INTO ${tableName} (id, type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`; 
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_ID = `DELETE FROM ${tableName} WHERE id = ?`;
const UPDATE_ID = `UPDATE ${tableName} SET type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frostingType = ?, frostingFlavor = ?, decorationType = ?, decorationColor = ?, customMessage = ?, shape = ?, allergies = ?, specialIngredients = ?, packagingType = ? WHERE id = ?`;
export class CakeRepository
  implements IRepository<IdentifiableCake>, Initializable
{
  async init() {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.exec(CREATE_TABLE);
    } catch (error) {
      logger.error("Error initializing cake repository:"+ error);
    }
  }
  async create(item: IdentifiableCake): Promise<ID> {
    // it is expected that a transaction had been started before calling this method, so we do not start a transaction here
    const conn = await ConnectionManager.getConnection();
    try {
      await conn.run(
        INSERT_CAKE,
        item.getId(),
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType(),
      );
      return { getId: () => item.getId() };
    } catch (error) {
      console.error("Error creating cake:", error);
      throw new Error("Failed to create cake.");
    }
  }
  async get(id: ID): Promise<IdentifiableCake> {
    try {
        const conn = await ConnectionManager.getConnection();
        const row = await conn.get<SQLiteCake>(SELECT_BY_ID, id.getId());
        if(!row){
            throw new Error(`Cake with id ${id.getId()} not found.`);
        }
        return new SQLiteCakeMapper().map(row);
    } catch (error) {
        logger.error("Error fetching cake:", error);
        throw new ItemNotFoundException(`Failed to fetch cake with id ${id.getId()}.`);
    }
  }
  async getAll(): Promise<IdentifiableCake[]> {
    try {
      const conn = await ConnectionManager.getConnection();
      const rows = await conn.all<SQLiteCake[]>(SELECT_ALL);
      return rows.map(row => new SQLiteCakeMapper().map(row));
    } catch (error) {
      logger.error("Error fetching all cakes:", error);
      throw new Error("Failed to fetch all cakes.");
    }
  }
  async update(item: IdentifiableCake): Promise<void> {
    try{
      const conn = await ConnectionManager.getConnection();
      await conn.run(
        UPDATE_ID,
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType(),
        item.getId()
      );
    } catch (error) {
      logger.error("Error updating cake:", error);
      throw new Error("Failed to update cake.");
    }
  }
  async delete(id: ID): Promise<void> {
    try {
        const conn = await ConnectionManager.getConnection();
        await conn.run(DELETE_ID, id.getId());
    } catch (error) {
        logger.error("Error deleting cake:", error);
        throw new Error("Failed to delete cake.");
    };
  }
}
