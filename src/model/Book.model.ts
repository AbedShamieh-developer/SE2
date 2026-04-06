import { Item, ItemCategory } from "./Item.model";

export class Book implements Item{
    constructor(
        private title: string,
        private author: string,
        private genre: string,
        private language: string,
        private format: string,
        private publisher: string,
        private isbn: string,
        private publicationYear: number
    ) {}

    getTitle(): string {
        return this.title;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): string {
        return this.genre;
    }

    getLanguage(): string {
        return this.language;
    }

    getFormat(): string {
        return this.format;
    }

    getPublisher(): string {
        return this.publisher;
    }

    getIsbn(): string {
        return this.isbn;
    }

    getPublicationYear(): number {
        return this.publicationYear;
    }

    getCategory(): ItemCategory {
        return ItemCategory.BOOK;
    }
}
