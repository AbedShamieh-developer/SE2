import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import { DatabaseConnectionException } from "../../util/exceptions/repositoryExceptions";

dotenv.config();

export class ConnectionManager {
    private static db: Database | null = null;
    private constructor() {}
    static async getConnection(): Promise<Database> {
        if (!this.db) {
            try {
                this.db = await open({
                    filename: process.env.ORDERS_PATH || "src/data/orders.db",
                    driver: sqlite3.Database
                });
            } catch (error) {
                throw new DatabaseConnectionException("Failed to connect to the database.");
            }
        }
        return this.db;
    }
}
