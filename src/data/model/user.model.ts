import { VALID_COUNTRIES, VALID_TITLES } from '@data/constants/constants';
import { faker } from '@faker-js/faker';
import { ArraysUtils } from '@utils/arrays.utils';
import { AddressType } from './address.model';

export interface UserType {
    name: string,
    email: string,
    password: string,
    address: AddressType
}

export function GenerateRandomUser(): UserType {
    const dob: Date = faker.date.birthdate();
    return {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: {
            title: ArraysUtils.getRandomElement(VALID_TITLES),
            birthDate: dob.getUTCDate().toString(),
            birthMonth: dob.getUTCMonth().toString(),
            birthYear: dob.getUTCFullYear().toString(),
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            company: faker.company.name(),
            addressOne: faker.location.postalAddress(),
            addressTwo: faker.location.secondaryAddress(),
            country: ArraysUtils.getRandomElement(VALID_COUNTRIES),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number()
        }
    }
}