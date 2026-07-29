import {
  getRandomCreditCardCvc,
  getRandomCreditCardExpirationMonth,
  getRandomCreditCardExpirationYear,
  getRandomCreditCardNumber,
} from "@utils/number.utils";
import { generateRandomName } from "@utils/string.utils";

/** Credit card details, as submitted to the site's payment form. */
export interface CreditCardDetailsType {
  name: string;
  number: number;
  cvc: number;
  expirationMonth: number;
  expirationYear: number;
}

/** Per-field overrides for {@link generateRandomCard}; any field left unset is randomly generated. */
export interface CreateRandomCardOptions {
  name?: string;
  number?: number;
  cvc?: number;
  expirationMonth?: number;
  expirationYear?: number;
}

/**
 * Generates a random, syntactically valid {@link CreditCardDetailsType}.
 *
 * @param options - Overrides for any individual field; unset fields are randomly generated.
 * @returns A new, randomly generated set of credit card details.
 */
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
