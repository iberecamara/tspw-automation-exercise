import { NumberUtils } from "@utils/number.utils";
import { StringUtils } from "@utils/string.utils";

export interface CreditCardDetailsType {
  name: string;
  number: number;
  cvc: number;
  expirationMonth: number;
  expirationYear: number;
}

export type CreateRandomCardOptions = {
  name?: string;
  number?: number;
  cvc?: number;
  expirationMonth?: number;
  expirationYear?: number;
};

export function GenerateRandomCard(
  options?: CreateRandomCardOptions,
): CreditCardDetailsType {
  const name: string = options?.name ?? StringUtils.generateRandomName();
  const number: number =
    options?.number ?? NumberUtils.getRandomCreditCardNumber();
  const cvc: number = options?.cvc ?? NumberUtils.getRandomCreditCardCvc();
  const expirationMonth: number =
    options?.expirationMonth ??
    NumberUtils.getRandomCreditCardExpirationMonth();
  const expirationYear: number =
    options?.expirationYear ?? NumberUtils.getRandomCreditCardExpirationYear();
  return {
    name,
    number,
    cvc,
    expirationMonth,
    expirationYear,
  };
}
