import { faker } from "@faker-js/faker";

export function getRandomNumber(options?: {
  min?: number;
  max?: number;
}): number {
  return faker.number.int({ min: options?.min, max: options?.max });
}

export function getRandomCreditCardNumber(): number {
  return +faker.finance.creditCardNumber("################");
}

export function getRandomCreditCardCvc(): number {
  return +faker.finance.creditCardCVV();
}

export function getRandomCreditCardExpirationMonth(): number {
  return faker.date.future().getUTCMonth() + 1;
}

export function getRandomCreditCardExpirationYear(): number {
  return faker.date.future().getUTCFullYear();
}
