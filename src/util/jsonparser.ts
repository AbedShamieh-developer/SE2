import fs from 'fs';

/**
 * Utility to read a JSON file and return typed array data.
 */
export const parseJsonFile = <T>(filePath: string): T[] => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);

    if (Array.isArray(parsedData)) {
      return parsedData as T[];
    }

    return [parsedData as T];
  } catch (error) {
    console.error("Failed to read or parse JSON file:", error);
    return [];
  }
};
