export interface ICurrency {
    currencyCode(): string;
}
export interface ITax {
    taxRate(): number;
}
export interface ICurrencyFactory{
    createCurrency(): ICurrency;
    createTax(): ITax;
    applyTax(amount: number): string;
}
export class EuroCurrency implements ICurrency {
    currencyCode(): string {
        return "EUR";
    }
}
export class EuroTax implements ITax {
    taxRate(): number {
        return 0.20;
    }
}
export class DollarCurrency implements ICurrency {
    currencyCode(): string {
        return "USD";
    }
}
export class DollarTax implements ITax {
    taxRate(): number {
        return 0.10;
    }
}
export class EuroCurrencyFactory implements ICurrencyFactory {
    applyTax(amount: number): string {
        const result = amount * (1 + this.createTax().taxRate());
        return `${result.toFixed(2).replace(".", ",")} €`;
    }
    createCurrency(): ICurrency {
        return new EuroCurrency();
    }
    createTax(): ITax {
        return new EuroTax();
    }
}
export class DollarCurrencyFactory implements ICurrencyFactory {
    applyTax(amount: number): string {
        const result = amount * (1 + this.createTax().taxRate());
        return `$${result.toFixed(2)}`;
    }
    createCurrency(): ICurrency {
        return new DollarCurrency();
    }
    createTax(): ITax {
        return new DollarTax();
    }
}
const value: number = 180.88;
const currencyFactory: ICurrencyFactory = new EuroCurrencyFactory();
const currencyEUR = currencyFactory.createCurrency();
const taxEUR = currencyFactory.createTax();
const formattedValue = currencyFactory.applyTax(value);
console.log(`Currency: ${currencyEUR.currencyCode()}`);
console.log(`Tax Rate: ${taxEUR.taxRate() * 100}%`);
console.log(`Value before tax: ${value}${currencyEUR.currencyCode()}`);
console.log(`Formatted final value: ${formattedValue}`);