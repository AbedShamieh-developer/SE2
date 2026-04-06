import { ItemNameValidator, MaxPriceValidator, OrderCalculator, OrderManagement, ValidatePrice, OrderRepository, Validator } from "./app-clean";

// main.ts
import logger from "./util/logger";
// Initialize system
const validator = new Validator();
const repository = new OrderRepository();
const calculator = new OrderCalculator();
const orderManagement = new OrderManagement(validator, calculator, repository);

// Helper to safely add order
function safeAddOrder(item: string, price: number) {
  try {
    orderManagement.addOrder(item, price);
    logger.info(`Order added: ${item} - $${price}`);
  } catch (err: any) {
    logger.error(`Failed to add order: ${item} - $${price}. Reason: ${err.message}`);
  }
}

// Demo operations
safeAddOrder("Chocolate", 50);
safeAddOrder("Sponge", 20);
safeAddOrder("InvalidItem", 30); // will throw an error and be logged

// Show all orders
const allOrders = orderManagement.getOrder();
logger.info(`Current orders: ${JSON.stringify(allOrders)}`);

// Get revenue
const revenue = orderManagement.getRevenue();
logger.info(`Total revenue: $${revenue}`);

// Get average buy power
const average = orderManagement.getAverageBuyPower();
logger.info(`Average buy power: $${average}`);

// Remove an order
orderManagement.removeOrder(1);
logger.info("Order with ID 1 removed");

// Show updated orders
logger.info(`Orders after removal: ${JSON.stringify(orderManagement.getOrder())}`);