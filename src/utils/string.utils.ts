import { EMPTY, NEWLINE } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

export function capitalize(text: string): string {
  return text.replace(/^\w/, (c) => c.toUpperCase());
}

export function capitalizeAll(text: string): string {
  return text
    .split(/(\s+)/)
    .map((word) => capitalize(word))
    .join(EMPTY);
}

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

export function generateRandomName(): string {
  return faker.person.fullName();
}

export function generateRandomEmail(): string {
  return faker.internet.email();
}

export function generateRandomText(options?: { words?: number }): string {
  return faker.word.words({ count: options?.words });
}
