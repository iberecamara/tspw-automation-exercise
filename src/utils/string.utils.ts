import { EMPTY, NEWLINE } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

/**
 * Capitalizes the first letter of a string, leaving the rest unchanged.
 *
 * @param text - The string to capitalize.
 * @returns `text` with its first character uppercased.
 */
export function capitalize(text: string): string {
  return text.replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Capitalizes the first letter of every word in a string.
 *
 * @param text - The string to capitalize.
 * @returns `text` with every word's first character uppercased, whitespace preserved as-is.
 */
export function capitalizeAll(text: string): string {
  return text
    .split(/(\s+)/)
    .map((word) => capitalize(word))
    .join(EMPTY);
}

/**
 * Pretty-prints any value as indented JSON, for readable log/report output.
 *
 * @param target - The value to stringify.
 * @param options.sameline - If `true`, returns just the stringified value with no surrounding
 * whitespace. If `false` (default), pads the output with a leading newline and trailing space,
 * so it reads well when interpolated mid-sentence into a log line.
 * @returns The pretty-printed value, or a description of the error if it couldn't be stringified
 * (e.g. a circular reference).
 */
export function prettyJson<T>(
  target: T,
  options?: { sameline?: boolean },
): string {
  let stringfied: string = parseJson(target);
  const shouldAddNewline = options?.sameline ?? false;

  if (!shouldAddNewline) {
    stringfied = `${NEWLINE}${stringfied} `;
  }

  return stringfied;
}

/**
 * Attempts to `JSON.stringify` a value with 4-space indentation, falling back to a readable
 * error description (rather than throwing) if the value can't be serialized.
 */
function parseJson<T>(target: T) {
  let stringfied: string;
  try {
    stringfied = JSON.stringify(target, null, 4);
  } catch (error) {
    if (error instanceof SyntaxError) {
      stringfied = error.message;
    } else if (error instanceof Error) {
      stringfied = `Error: ${error.message}`;
    } else if (typeof error === "string") {
      stringfied = error;
    } else {
      stringfied = "Unknown error";
    }
  }
  return stringfied;
}

/** Generates a random full person name. */
export function generateRandomName(): string {
  return faker.person.fullName();
}

/** Generates a random, syntactically valid email address. */
export function generateRandomEmail(): string {
  return faker.internet.email();
}

/**
 * Generates random lorem-ipsum-style text.
 *
 * @param options.words - Number of words to generate. Defaults to faker's own default count.
 */
export function generateRandomText(options?: { words?: number }): string {
  return faker.word.words({ count: options?.words });
}
