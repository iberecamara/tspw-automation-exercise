import { VALID_COUNTRIES, VALID_TITLES } from "@data/constants/constants";
import { faker } from "@faker-js/faker";
import { ArraysUtils } from "@utils/arrays.utils";
import { AddressType } from "./address.model";

export interface UserType {
  id?: number;
  name: string;
  email: string;
  password?: string;
  address: AddressType;
}

export function GenerateRandomUser(options?: {
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
      faker.internet.displayName({ firstName: firstName, lastName: lastName }),
    email:
      options?.email ??
      faker.internet
        .email({ firstName: firstName, lastName: lastName })
        .toLocaleLowerCase(),
    password: options?.password ?? faker.internet.password(),
    address: {
      title: ArraysUtils.getRandomElement(VALID_TITLES),
      birthDate: dob.getUTCDate().toString(),
      birthMonth: (dob.getUTCMonth() + 1).toString(),
      birthYear: dob.getUTCFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      addressOne: faker.location.streetAddress(),
      addressTwo: faker.location.secondaryAddress(),
      country: ArraysUtils.getRandomElement(VALID_COUNTRIES),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number({ style: "mobile" }),
    },
  };
}
