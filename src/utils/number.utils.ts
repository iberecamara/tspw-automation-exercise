import { faker } from '@faker-js/faker';

export class NumberUtils {

    public static getRandomNumber(options?: { min?: number; max?: number }): number {
        return faker.number.int({ min: options?.min, max: options?.max });
    }

}
