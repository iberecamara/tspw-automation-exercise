import {
  getRandomCreditCardCvc,
  getRandomCreditCardExpirationMonth,
  getRandomCreditCardExpirationYear,
  getRandomCreditCardNumber,
} from "@utils/number.utils";
import { generateRandomName } from "@utils/string.utils";

export interface CreditCardDetailsType {
  name: string;
  number: number;
  cvc: number;
  expirationMonth: number;
  expirationYear: number;
}

export interface CreateRandomCardOptions {
  name?: string;
  number?: number;
  cvc?: number;
  expirationMonth?: number;
  expirationYear?: number;
}

export function generateRandomCard(
  options?: CreateRandomCardOptions,
): CreditCardDetailsType {
  const name: string = options?.name ?? generateRandomName();
  const number: number = options?.number ?? getRandomCreditCardNumber();
  const cvc: number = options?.cvc ?? getRandomCreditCardCvc();
  const expirationMonth: number =
    options?.expirationMonth ?? getRandomCreditCardExpirationMonth();
  const expirationYear: number =
    options?.expirationYear ?? getRandomCreditCardExpirationYear();
  return {
    name,
    number,
    cvc,
    expirationMonth,
    expirationYear,
  };
}
