import { OrderRepository } from "../../src/repository/sqlite/Order.repository";
import { ConnectionManager } from "../../src/repository/sqlite/ConnectionManager";
import { IdentifiableItem, ItemCategory } from "../../src/model/IItem.model";
import logger from "../../src/util/logger";

// Mock the ConnectionManager
jest.mock("../../src/repository/sqlite/ConnectionManager");

// Mock the logger
jest.mock("../../src/util/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;
  let mockItemRepository: jest.Mocked<any>;
  let mockConnection: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock connection
    mockConnection = {
      get: jest.fn(),
      run: jest.fn(),
      exec: jest.fn(),
    };

    // Mock ConnectionManager.getConnection
    (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(
      mockConnection
    );

    // Mock item repository
    mockItemRepository = {
      init: jest.fn(),
      create: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    orderRepository = new OrderRepository(mockItemRepository);
  });

  describe("create", () => {
    it("should create an order successfully and log no errors", async () => {
      // Arrange
      const mockItem: IdentifiableItem = {
        getId: () => "1",
        getCategory: () => ItemCategory.CAKE,
        getItem: () => ({
          getCategory: () => ItemCategory.CAKE,
        }),
      };

      const mockOrder = {
        getId: () => "order-123",
        getQuantity: () => 2,
        getPrice: () => 29.99,
        getItem: () => mockItem,
      };

      mockItemRepository.create.mockResolvedValue({ getId: () => "item-1" });
      mockConnection.run.mockResolvedValue({ lastID: 1 });
      mockConnection.exec.mockResolvedValue(undefined);

      // Act
      const result = await orderRepository.create(mockOrder as any);

      // Assert
      expect(result.getId()).toBe("order-123");
      expect(mockConnection.exec).toHaveBeenCalledWith("BEGIN TRANSACTION");
      expect(mockConnection.exec).toHaveBeenCalledWith("COMMIT");
      expect(mockItemRepository.create).toHaveBeenCalledWith(mockItem);
      expect(mockConnection.run).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO orders"),
        2,
        29.99,
        "cake",
        "item-1"
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should rollback transaction and throw error on creation failure", async () => {
      // Arrange
      const mockItem: IdentifiableItem = {
        getId: () => "1",
        getCategory: () => ItemCategory.CAKE,
        getItem: () => ({
          getCategory: () => ItemCategory.CAKE,
        }),
      };

      const mockOrder = {
        getId: () => "order-123",
        getQuantity: () => 2,
        getPrice: () => 29.99,
        getItem: () => mockItem,
      };

      mockItemRepository.create.mockResolvedValue({ getId: () => "item-1" });
      mockConnection.run.mockRejectedValue(new Error("Database error"));
      mockConnection.exec.mockResolvedValue(undefined);

      // Act & Assert
      await expect(orderRepository.create(mockOrder as any)).rejects.toThrow(
        "Failed to create order."
      );
      expect(mockConnection.exec).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should rollback transaction when item creation fails", async () => {
      // Arrange
      const mockItem: IdentifiableItem = {
        getId: () => "1",
        getCategory: () => ItemCategory.CAKE,
        getItem: () => ({
          getCategory: () => ItemCategory.CAKE,
        }),
      };

      const mockOrder = {
        getId: () => "order-123",
        getQuantity: () => 2,
        getPrice: () => 29.99,
        getItem: () => mockItem,
      };

      mockItemRepository.create.mockRejectedValue(
        new Error("Failed to create item")
      );
      mockConnection.exec.mockResolvedValue(undefined);

      // Act & Assert
      await expect(orderRepository.create(mockOrder as any)).rejects.toThrow(
        "Failed to create order."
      );
      expect(mockConnection.exec).toHaveBeenCalledWith("ROLLBACK");
    });
  });

  describe("get", () => {
    it("should fetch an order successfully and log the fetched row", async () => {
      // Arrange
      const orderId = { getId: () => "1" };
      const mockRow = {
        id: "1",
        quantity: 2,
        price: 29.99,
        item_category: "cake",
        item_id: "item-1",
      };

      const mockItem: IdentifiableItem = {
        getId: () => "item-1",
        getCategory: () => ItemCategory.CAKE,
        getItem: () => ({
          getCategory: () => ItemCategory.CAKE,
        }),
      };

      mockConnection.get.mockResolvedValue(mockRow);
      mockItemRepository.get.mockResolvedValue(mockItem);

      // Act
      const result = await orderRepository.get(orderId);

      // Assert
      expect(mockConnection.get).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM orders WHERE id = ?"),
        "1"
      );
      expect(mockItemRepository.get).toHaveBeenCalledWith({
        getId: expect.any(Function),
      });
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Fetched order row:")
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should throw error and log when order is not found", async () => {
      // Arrange
      const orderId = { getId: () => "999" };
      mockConnection.get.mockResolvedValue(null);

      // Act & Assert
      await expect(orderRepository.get(orderId)).rejects.toThrow(
        "Failed to fetch order."
      );
      expect(logger.error).toHaveBeenCalled();
    });

    it("should throw error and log when item fetch fails", async () => {
      // Arrange
      const orderId = { getId: () => "1" };
      const mockRow = {
        id: "1",
        quantity: 2,
        price: 29.99,
        item_category: "cake",
        item_id: "item-1",
      };

      mockConnection.get.mockResolvedValue(mockRow);
      mockItemRepository.get.mockRejectedValue(new Error("Item not found"));

      // Act & Assert
      await expect(orderRepository.get(orderId)).rejects.toThrow(
        "Failed to fetch order."
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching order:",
        expect.any(Error)
      );
    });

    it("should throw error and log when database connection fails", async () => {
      // Arrange
      const orderId = { getId: () => "1" };
      mockConnection.get.mockRejectedValue(
        new Error("Database connection error")
      );

      // Act & Assert
      await expect(orderRepository.get(orderId)).rejects.toThrow(
        "Failed to fetch order."
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching order:",
        expect.any(Error)
      );
    });
  });
});
