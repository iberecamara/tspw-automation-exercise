import { VALID_COUNTRIES, VALID_TITLES } from "@data/constants/constants";
import { faker } from "@faker-js/faker";
import { getRandomElement } from "@utils/arrays.utils";
import { AddressType } from "./address.model";

/** A user account, as used across UI and API tests. */
export interface UserType {
  /** Account ID, populated once the account exists (e.g. after fetching it via {@link UserApi.getUser}). */
  id?: number;
  name: string;
  email: string;
  /** Plaintext password. Required by {@link UserApi.createUser}/{@link UserApi.updateUser}, but optional here since a user may be constructed before a password is known/needed. */
  password?: string;
  address: AddressType;
}

/**
 * Generates a random, internally consistent {@link UserType} — a randomly generated name/email
 * unless overridden, a random birthdate-derived address title, and a fully populated
 * {@link AddressType} with random values for every other field.
 *
 * @param options.name - Overrides the generated display name.
 * @param options.email - Overrides the generated email.
 * @param options.password - Overrides the generated password.
 * @returns A new, randomly generated user.
 */
export function generateRandomUser(options?: {
  name?: string;
  email?: string;
  password?: string;
}): UserType {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dob: Date = faker.date.birthdate();

  return {
    name:
      options?.name ??
      faker.internet
        .displayName({ firstName: firstName, lastName: lastName })
        .toLowerCase(),
    email:
      options?.email ??
      faker.internet
        .email({ firstName: firstName, lastName: lastName })
        .toLocaleLowerCase(),
    password: options?.password ?? faker.internet.password(),
    address: {
      title: getRandomElement(VALID_TITLES),
      birthDate: dob.getUTCDate().toString(),
      birthMonth: (dob.getUTCMonth() + 1).toString(),
      birthYear: dob.getUTCFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      addressOne: faker.location.streetAddress(),
      addressTwo: faker.location.secondaryAddress(),
      country: getRandomElement(VALID_COUNTRIES),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number({ style: "mobile" }),
    },
  };
}
