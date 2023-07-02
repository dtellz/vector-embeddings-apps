import fs from "fs/promises";
import Papa from "papaparse";

export const loadCsvFile = async (
  filePath: string
): Promise<Papa.ParseResult<Record<string, unknown>>> => {
  try {
    const csvAbsPath = await fs.realpath(filePath);
    const data = await fs.readFile(csvAbsPath, "utf8");
    return Papa.parse(data, {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
