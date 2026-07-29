import fs from "fs";
import path from "path";

/**
 * Reads a text file and returns its content as an array of trimmed, non-empty lines.
 *
 * @param filename - Path to the file, resolved relative to the current working directory.
 * @returns Every non-blank line of the file, trimmed of leading/trailing whitespace.
 */
export function readFile(filename: string): string[] {
  return fs
    .readFileSync(path.resolve(filename), "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
