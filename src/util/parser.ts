import { readFile, writeFile } from "fs/promises"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

export interface CSVParseOptions {
    skipHeader?: boolean
}

export interface CSVWriteOptions {
    header?: string[]
}
export interface IParser {
    parseRows(filePath: string, options?: CSVParseOptions): Promise<string[][]>;
    stringifyRows(rows: string[][], options?: CSVWriteOptions): string;
    writeRows(filePath: string, rows: string[][], options?: CSVWriteOptions): Promise<void>;
    toPrettyJSON(data: unknown): string;
}
export class CSVParser implements IParser {
    async parseRows(filePath: string, options: CSVParseOptions = {}): Promise<string[][]> {
        const raw = await readFile(filePath, "utf-8")
        const rows = parse(raw, {
            from_line: options.skipHeader ? 2 : 1,
            trim: true,
            skip_empty_lines: true
        })

        return rows as string[][]
    }

    stringifyRows(rows: string[][], options: CSVWriteOptions = {}): string {
        const records = options.header ? [options.header, ...rows] : rows

        return stringify(records)
    }

    async writeRows(filePath: string, rows: string[][], options: CSVWriteOptions = {}): Promise<void> {
        const csvContent = this.stringifyRows(rows, options)
        await writeFile(filePath, csvContent, "utf-8")
    }

    toPrettyJSON(data: unknown): string {
        return JSON.stringify(data, null, 2)
    }
}
