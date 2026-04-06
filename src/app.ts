
// let orderId = 6; // Start new orders from ID 6

// // Adding a new order directly
// const newItem = "Marble";
// const newPrice = 22;

// if (!possibleItems.includes(newItem)) {
//   throw new Error(`Invalid item. Must be one of: ${possibleItems.join(", ")}`);
// }
// if (newPrice <= 0) {
//   throw new Error("Price must be greater than zero");
// }

// const newOrder = { id: orderId++, item: newItem, price: newPrice };
// orders.push(newOrder);

// console.log("Orders after adding a new order:", orders);

// // Calculate Total Revenue directly
// const totalRevenue = orders.reduce((total, order) => total + order.price, 0);
// console.log("Total Revenue:", totalRevenue);

// // Calculate Average Buy Power directly
// const averageBuyPower = orders.length === 0 ? 0 : totalRevenue / orders.length;
// console.log("Average Buy Power:", averageBuyPower.toFixed(2));

// // Fetching an order directly
// const fetchId = 2;
// const fetchedOrder = orders.find(order => order.id === fetchId);
// console.log("Order with ID 2:", fetchedOrder);

// // Attempt to fetch a non-existent order
// const nonExistentId = 10;
// const nonExistentOrder = orders.find(order => order.id === nonExistentId);
// console.log("Order with ID 10 (non-existent):", nonExistentOrder);