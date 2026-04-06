interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
}

class LibraryManagement {
    private books: Book[] =  [];
    private static nextId = 1;
    constructor(public validator: IValidate[],public calculator: ICalculator){}

    addBook(title: string,author: string,price: number): void{
        let newBook = {id: LibraryManagement.nextId++,title,author,price}
         this.validator.forEach(v=> v.validate(newBook))
        this.books.push(newBook)
    }
    removeBook(id: number){
        let foundBookIndex = this.books.findIndex(book=>book.id === id)
        if(foundBookIndex === -1) throw new Error("Not found")
        this.books.splice(foundBookIndex,1)
    }
    getAllBooks(): Book[]{
        return [...this.books]
    }
    getRevenue(): number{
        return this.calculator.getTotalValue(this.books)
    }
    getAverage(): number{
        return this.calculator.getAveragePrice(this.books)
    }
}
interface IValidate {
    validate(book: Book):void
}
class ValidateAuthor implements IValidate{
    validate(book: Book): void {
        if(!book.author)
        throw new Error("Method not implemented.");
    }

}
class ValidateTitle implements IValidate{
    validate(book: Book): void {
        if(!book.title)
        throw new Error("Method not implemented.");
    }

}
class ValidatePrice implements IValidate{
    validate(book: Book): void {
        if(book.price <= 0)
        throw new Error("Method not implemented.");
    }

}


interface ICalculator{
    getTotalValue(books: Book[]): number
    getAveragePrice(books: Book[]): number
}
// Add Finance
class FinanceLibrary implements ICalculator{
    getTotalValue(books: Book[]): number {
        return books.reduce((total, book) => total + book.price, 0);
    }
    getAveragePrice(books: Book[]): number {
        return books.length === 0 ? 0 : this.getTotalValue(books) / books.length;
    }
    
}