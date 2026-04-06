import {ICalculator, IOrderRepository, ItemNameValidator, IValidator, MaxPriceValidator, Order, OrderCalculator, OrderManagement, OrderRepository, ValidatePrice, Validator} from "../src/app-clean";

describe("OrderManagement", () => {
  let validator: IValidator;
  let calculator: ICalculator
  let repository: IOrderRepository
  let orderManagement: OrderManagement
  let baseValidator: (order: Order)=> void
  beforeAll(()=>{
    validator = new Validator();
    calculator = new OrderCalculator();
  });
  beforeEach(() => {
    // Reset the static nextId counter before each test
    (OrderRepository as any)["nextId"] = 1;
    repository = new OrderRepository();
    orderManagement = new OrderManagement(validator,calculator,repository);
    baseValidator = validator.validate
    validator.validate = jest.fn();
  });
  it("should add an order", () => {
    //Act
    orderManagement.addOrder("Sponge",20);

    expect(orderManagement.getOrder()).toEqual([{id: 1,item: "Sponge",price: 20}])
  });
  it("should throw an error",()=>{
    // Arrange
    const item = "sponge"
    const price = 20;
    (validator.validate as jest.Mock).mockImplementation(()=>{
      throw new Error("Invalid order")
    })
    //Assert
    expect(()=> orderManagement.addOrder(item,price)).toThrow("Invalid")
  });
  it("should get a specific order by ID", () => {
    // Arrange
    const item = "Sponge";
    const price = 50;
    orderManagement.addOrder(item, price);

    //Act
    const order = orderManagement.getOrderById(1);

    // Assert
    expect(order).toEqual({ id: 1, item, price });
  });
  it("should return revenue",()=>{
    orderManagement.addOrder("sponge",20)
    orderManagement.addOrder("Red Velvet",20)
    const spy = jest.spyOn(calculator,"getRevenue")

    //Act
    const revenue = orderManagement.getRevenue();

    //Assert
    expect(spy).toHaveBeenCalled();
    console.log(spy.mock.results)
  });
  it("should return average buy power",()=>{
    orderManagement.addOrder("sponge",20)
    orderManagement.addOrder("Red Velvet",20)

    //Act
   let averageBuyPower = orderManagement.getAverageBuyPower();

   // Assertion
   expect(averageBuyPower).toBe(20);
  });
  it("should remove order with specific id",()=>{
    orderManagement.addOrder("sponge",20);

    //Act
    orderManagement.removeOrder(1);

    //Assertion
    expect(orderManagement.getOrder()).toEqual([])
  });
});
  


