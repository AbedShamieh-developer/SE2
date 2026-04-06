// class PaymentService {
//   pay(amount: number, method: string) {
//     if (method === "card") {
//       console.log("Paying with card");
//     } else if (method === "paypal") {
//       console.log("Paying with PayPal");
//     } else if (method === "crypto") {
//       console.log("Paying with crypto");
//     }
//   }
// }

interface PaymentService {
    pay(amount: number): void
}
class ManagePayments {
    constructor(private pService: PaymentService){}
    pay(amount: number){
        this.pService.pay(amount)
    }
}
class PayWithCard implements PaymentService {
    pay(amount: number): void {
        console.log(`Paying  ${amount}$ with card`)
    }
}
class PayWithPayPal implements PaymentService {
    pay(amount: number): void {
        console.log(`Paying  ${amount}$ with paypal`)
    }
}
class PayWithCrypto implements PaymentService {
    pay(amount: number): void {
        console.log(`Paying  ${amount}$ with crypto`)
    }
}