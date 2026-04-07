import { Book } from "../Book.model"

export class BookBuilder {
    private title!: string
    private author!: string
    private genre!: string
    private language!: string
    private format!: string
    private publisher!: string
    private isbn!: string
    private publicationYear!: number

    private validateRequiredText(value: string, fieldName: string): string {
        if (!value || !value.trim()) {
            throw new Error(`${fieldName} is required`)
        }

        return value.trim()
    }

    private validateRequiredNumber(value: number, fieldName: string): number {
        if (value <= 0) {
            throw new Error(`${fieldName} must be greater than 0`)
        }

        return value
    }

    setTitle(title: string): this {
        this.title = this.validateRequiredText(title, "title")
        return this
    }

    setAuthor(author: string): this {
        this.author = this.validateRequiredText(author, "author")
        return this
    }

    setGenre(genre: string): this {
        this.genre = this.validateRequiredText(genre, "genre")
        return this
    }

    setLanguage(language: string): this {
        this.language = this.validateRequiredText(language, "language")
        return this
    }

    setFormat(format: string): this {
        this.format = this.validateRequiredText(format, "format")
        return this
    }

    setPublisher(publisher: string): this {
        this.publisher = this.validateRequiredText(publisher, "publisher")
        return this
    }

    setIsbn(isbn: string): this {
        this.isbn = this.validateRequiredText(isbn, "isbn")
        return this
    }

    setPublicationYear(publicationYear: number): this {
        this.publicationYear = this.validateRequiredNumber(publicationYear, "publicationYear")
        return this
    }

    build(): Book {
        const requiredProperties = [
            this.title,
            this.author,
            this.genre,
            this.language,
            this.format,
            this.publisher,
            this.isbn,
            this.publicationYear
        ]

        for (const property of requiredProperties) {
            if (!property) {
                throw new Error("All book properties are required")
            }
        }

        return new Book(
            this.title,
            this.author,
            this.genre,
            this.language,
            this.format,
            this.publisher,
            this.isbn,
            this.publicationYear
        )
    }
}
