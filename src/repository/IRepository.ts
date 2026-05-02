import { IItem } from "../model/IItem.model";
import { IOrder } from "../model/IOrder.model";
import { Order } from "../model/Order";

export interface ID {
    getId(): string
}

/**
 * Represents a component that requires asynchronous initialization
 * before it can be used safely.
 */
export interface Initializable{
    /**
     * Performs the initialization logic required by the implementing component.
     *
     * @returns A Promise that resolves when initialization completes successfully.
     */
    init(): Promise<void>
}
export interface IdentifiableItemOrder extends ID, IOrder {}
export interface InitializeRepository<T extends ID> extends IRepository<T>, Initializable {}
export interface IRepository<T extends ID> {
    /**
     * Persists a new entity in the repository.
     *
     * @param item The entity to create.
     * @returns The identifier assigned to the created entity.
     * @throws {InvalidItemException} When the provided entity is invalid or cannot be stored.
     */
    create(item: T): Promise<ID>;

    /**
     * Retrieves a single entity by its identifier.
     *
     * @param id The identifier of the entity to retrieve.
     * @returns The matching entity.
     * @throws {ItemNotFoundException} When no entity exists with the provided identifier.
     */
    get(id: ID): Promise<T>;

    /**
     * Retrieves every entity stored in the repository.
     *
     * @returns A collection containing all stored entities.
     */
    getAll(): Promise<T[]>

    /**
     * Replaces the data of an existing entity using the identifier carried by the entity itself.
     *
     * @param item The entity containing the identifier of the record to update and its new persisted state.
     * @returns A Promise that resolves when the update operation completes successfully.
     * @throws {ItemNotFoundException} When no entity exists with the identifier carried by the provided entity.
     * @throws {InvalidItemException} When the provided entity data is invalid.
     */
    update(item: T): Promise<void>

    /**
     * Removes an entity from the repository.
     *
     * @param id The identifier of the entity to delete.
     * @throws {ItemNotFoundException} When no entity exists with the provided identifier.
     */
    delete(id: ID): Promise<void>
}
