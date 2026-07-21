import { EMPTY, NEWLINE } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

export class StringUtils {
  static capitalize(text: string): string {
    return text.replace(/^\w/, (c) => c.toUpperCase());
  }

  static capitalizeAll(text: string): string {
    return text
      .split(/(\s+)/)
      .map((word) => StringUtils.capitalize(word))
      .join(EMPTY);
  }

  static prettyJson<T>(target: T, options?: { sameline?: boolean }): string {
    let stringfied: string = StringUtils.parseJson(target);
    const shouldAddNewline = options?.sameline ?? false;

    if (!shouldAddNewline) {
      stringfied = `${NEWLINE}${stringfied} `;
    }

    return stringfied;
  }

  private static parseJson<T>(target: T) {
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

  static generateRandomName(): string {
    return faker.person.fullName();
  }

  static generateRandomEmail(): string {
    return faker.internet.email();
  }

  static generateRandomText(options?: { words?: number }): string {
    return faker.word.words({ count: options?.words });
  }
}
