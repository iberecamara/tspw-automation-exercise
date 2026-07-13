import { NEWLINE } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

export class StringUtils {

    static capitalize(text: string): string {
        return text.replace(/^\w/, (c) => c.toUpperCase());
    }

    static prettyJson<T>(target: T, options?: { newline?: boolean }): string {
        let stringfied = JSON.stringify(target, null, 4);

        const shouldAddNewline = options?.newline ?? true;

        if (shouldAddNewline) {
            stringfied = `${NEWLINE}${stringfied}`;
        }

        return stringfied
    }

    static generateRandomEmail(): string {
        return faker.internet.email();
    }

    static generateRandomText(options?: { words?: number }): string {
        return faker.word.words({ count: options?.words });
    }

}
