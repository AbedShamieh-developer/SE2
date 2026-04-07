import { CakeBuilder } from "./model/builders/Cake.builder";

let cakeBuilder = new CakeBuilder();
let cake = cakeBuilder.setType("Frosy")
    .setFlavor("Chocolate")
    .setFilling("Vanilla Cream")
    .setSize(8)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Blue")
    .setCustomMessage("Happy Birthday")
    .setShape("Round")
    .setAllergies("Milk")
    .setSpecialIngredients("Strawberries")
    .setPackagingType("Box")
    .build()
console.log(cake)