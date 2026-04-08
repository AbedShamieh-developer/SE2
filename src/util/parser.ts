import { readFile } from "fs/promises"
import { parse } from "csv-parse/sync"

export interface CSVParseOptions {
    skipHeader?: boolean
}

export class CSVParser {
    static async parseRows(filePath: string, options: CSVParseOptions = {}): Promise<string[][]> {
        const raw = await readFile(filePath, "utf-8")
        const rows = parse(raw, {
            from_line: options.skipHeader ? 2 : 1,
            trim: true,
            skip_empty_lines: true
        })

        return rows as string[][]
    }

    static toPrettyJSON(data: unknown): string {
        return JSON.stringify(data, null, 2)
    }
}
