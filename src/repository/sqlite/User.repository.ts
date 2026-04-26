import { IUser } from "../../model/IUser.model";
import { User } from "../../model/User.model";
import { ID, Initializable, IRepository } from "../IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";

type SQLiteUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`;
const INSERT_USER = `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`;
const SELECT_USER = `SELECT * FROM users WHERE id = ?`;
const SELECT_ALL_USERS = `SELECT * FROM users`;
const UPDATE_USER = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
const DELETE_USER = `DELETE FROM users WHERE id = ?`;

export class UserRepository implements IRepository<IUser>, Initializable {
  async init(): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.exec(CREATE_TABLE);
    } catch (error) {
      logger.error("Error initializing user repository:", error);
    }
  }

  async create(item: IUser): Promise<ID> {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.run(
        INSERT_USER,
        item.getId(),
        item.getName(),
        item.getEmail(),
        item.getPassword(),
      );
      return { getId: () => item.getId() };
    } catch (error) {
      logger.error("Error creating user:", error);
      throw new Error("Failed to create user.");
    }
  }

  async get(id: ID): Promise<IUser> {
    try {
      const conn = await ConnectionManager.getConnection();
      const row = await conn.get<SQLiteUser>(SELECT_USER, id.getId());
      if (!row) {
        throw new ItemNotFoundException(`User with id ${id.getId()} not found.`);
      }
      return new User(row.id, row.name, row.email, row.password);
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      logger.error("Error fetching user:", error);
      throw new Error("Failed to fetch user.");
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      const conn = await ConnectionManager.getConnection();
      const rows = await conn.all<SQLiteUser[]>(SELECT_ALL_USERS);
      return rows.map((row) => new User(row.id, row.name, row.email, row.password));
    } catch (error) {
      logger.error("Error fetching users:", error);
      throw new Error("Failed to fetch users.");
    }
  }

  async update(item: IUser): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      const result = await conn.run(
        UPDATE_USER,
        item.getName(),
        item.getEmail(),
        item.getPassword(),
        item.getId(),
      );
      if ((result?.changes ?? 0) === 0) {
        throw new ItemNotFoundException(`User with id ${item.getId()} not found.`);
      }
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      logger.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      const result = await conn.run(DELETE_USER, id.getId());
      if ((result?.changes ?? 0) === 0) {
        throw new ItemNotFoundException(`User with id ${id.getId()} not found.`);
      }
    } catch (error) {
      if (error instanceof ItemNotFoundException) {
        throw error;
      }
      logger.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }
  }
}

export async function createRepository(): Promise<UserRepository>{
    const repo = new UserRepository();
    await repo.init();
    return repo;
}
