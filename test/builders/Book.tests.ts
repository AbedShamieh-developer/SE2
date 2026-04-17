import { BookBuilder } from "../../src/model/builders/Book.builder"

describe("BookBuilder", () => {
    const createValidBuilder = () =>
        new BookBuilder()
            .setTitle("Clean Code")
            .setAuthor("Robert C. Martin")
            .setGenre("Programming")
            .setLanguage("English")
            .setFormat("Paperback")
            .setPublisher("Prentice Hall")
            .setIsbn("9780132350884")
            .setPublicationYear(2008)

    it("builds a book when all required properties are set", () => {
        const book = createValidBuilder().build()

        expect(book.getTitle()).toBe("Clean Code")
        expect(book.getAuthor()).toBe("Robert C. Martin")
        expect(book.getGenre()).toBe("Programming")
        expect(book.getLanguage()).toBe("English")
        expect(book.getFormat()).toBe("Paperback")
        expect(book.getPublisher()).toBe("Prentice Hall")
        expect(book.getIsbn()).toBe("9780132350884")
        expect(book.getPublicationYear()).toBe(2008)
    })

    it("throws when a text setter receives an empty value", () => {
        const builder = new BookBuilder()

        expect(() => builder.setTitle("   ")).toThrow("title is required")
    })

    it("throws when publication year is not greater than 0", () => {
        const builder = new BookBuilder()

        expect(() => builder.setPublicationYear(0)).toThrow("publicationYear must be greater than 0")
    })

    it("throws when build is called before all properties are set", () => {
        const builder = new BookBuilder().setTitle("Clean Code")

        expect(() => builder.build()).toThrow("All book properties are required")
    })
})
