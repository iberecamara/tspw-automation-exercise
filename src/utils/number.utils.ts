import { faker } from "@faker-js/faker";

/**
 * Generates a random integer.
 *
 * @param options.min - Minimum value (inclusive). Defaults to faker's own default range.
 * @param options.max - Maximum value (inclusive). Defaults to faker's own default range.
 * @returns A random integer within the given range.
 */
export function getRandomNumber(options?: {
  min?: number;
  max?: number;
}): number {
  return faker.number.int({ min: options?.min, max: options?.max });
}

/** Generates a random, syntactically valid 16-digit credit card number. */
export function getRandomCreditCardNumber(): number {
  return +faker.finance.creditCardNumber("################");
}

/** Generates a random 3-digit credit card CVC/CVV. */
export function getRandomCreditCardCvc(): number {
  return +faker.finance.creditCardCVV();
}

/** Generates a random credit card expiration month (1-12) from a date in the future. */
export function getRandomCreditCardExpirationMonth(): number {
  return faker.date.future().getUTCMonth() + 1;
}

/** Generates a random credit card expiration year from a date in the future. */
export function getRandomCreditCardExpirationYear(): number {
  return faker.date.future().getUTCFullYear();
}
