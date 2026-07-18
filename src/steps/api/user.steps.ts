import { UserApi } from "@api/user.api";
import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import { CustomResponseType } from "@data/types/custom-response.type";
import { UserResponseType } from "@data/types/user-response.type";
import { test } from "@fixtures/fixtures";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class UserApiSteps extends BaseSteps {
  readonly userApi: UserApi;

  constructor(userApi: UserApi) {
    super();
    this.userApi = userApi;
  }

  // Actions
  async createAccount(user: UserType): Promise<CustomResponseType> {
    this.logger.debug(`Creating user via API:${StringUtils.prettyJson(user)}`);
    let response = {} as CustomResponseType;

    await test.step("Create valid user via API", async () => {
      response = await this.userApi.createUser(user);
    });

    this.logger.debug("User created.");
    return response;
  }

  async deleteAccount(user: UserType): Promise<CustomResponseType> {
    this.logger.debug(`Deleting user via API:${StringUtils.prettyJson(user)}`);
    let response = {} as CustomResponseType;

    await test.step("Delete user via API", async () => {
      response = await this.userApi.deleteUser(
        user.email,
        user.password ?? EMPTY,
      );
    });

    this.logger.debug("User deleted.");
    return response;
  }

  async updateAccount(updatedUser: UserType): Promise<CustomResponseType> {
    this.logger.debug(
      `Updating user via API:${StringUtils.prettyJson(updatedUser)}`,
    );
    let response = {} as CustomResponseType;

    await test.step("Updating valid user via API", async () => {
      response = await this.userApi.updateUser(updatedUser);
    });

    this.logger.debug("User updated.");
    return response;
  }

  async getUserByEmail(email: string): Promise<CustomResponseType> {
    this.logger.debug("Retrieving Get User by Email.");
    let response = {} as CustomResponseType;

    await test.step("Retrieve Get User by Email", async () => {
      response = await this.userApi.getUser(email);
    });

    this.logger.debug("Retrieved Get User by Email.");
    return response;
  }

  // Validations
  async validateCreateAccount(response: CustomResponseType): Promise<void> {
    this.logger.debug("Validating Create User.");

    await test.step("Validate Create User", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Create User should be 201",
        )
        .toBe(201);
      const expectedMessage = "User created!";
      expect
        .soft(
          response.body.message,
          `Message (from body) for Create User should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  async validateDeleteAccount(response: CustomResponseType): Promise<void> {
    this.logger.debug("Validating Delete User.");

    await test.step("Validating Delete User", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Delete User should be 200",
        )
        .toBe(200);
      const expectedMessage = "Account deleted!";
      expect
        .soft(
          response.body.message,
          `Message (from body) for Delete User should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  async validateUpdateUserResponse(
    response: CustomResponseType,
  ): Promise<void> {
    this.logger.debug("Validating Update User.");

    await test.step("Validate Update User", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Update User should be 200",
        )
        .toBe(200);
      const expectedMessage = "User updated!";
      expect
        .soft(
          response.body.message,
          `Message (from body) for Update User should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  async validateUpdatedUser(
    updatedUser: UserType,
    retrievedUser: UserResponseType,
  ): Promise<void> {
    this.logger.debug("Validating Updated User.");

    await test.step("Validate Updated User", () => {
      expect
        .soft(
          updatedUser.name,
          `Updated user data should match the retrieved user data for email`,
        )
        .toStrictEqual(retrievedUser.name);
      expect
        .soft(
          updatedUser.email,
          `Updated user data should match the retrieved user data for email`,
        )
        .toStrictEqual(retrievedUser.email);
      expect
        .soft(
          updatedUser.address.title,
          `Updated user address data should match the retrieved user address data for title`,
        )
        .toStrictEqual(retrievedUser.title);
      expect
        .soft(
          updatedUser.address.birthDate,
          `Updated user address data should match the retrieved user address data for birth day`,
        )
        .toStrictEqual(retrievedUser.birth_day);
      expect
        .soft(
          updatedUser.address.birthMonth,
          `Updated user address data should match the retrieved user address data for birth month`,
        )
        .toStrictEqual(retrievedUser.birth_month);
      expect
        .soft(
          updatedUser.address.birthYear,
          `Updated user address data should match the retrieved user address data for birth year`,
        )
        .toStrictEqual(retrievedUser.birth_year);
      expect
        .soft(
          updatedUser.address.firstname,
          `Updated user address data should match the retrieved user address data for first name`,
        )
        .toStrictEqual(retrievedUser.first_name);
      expect
        .soft(
          updatedUser.address.lastname,
          `Updated user address data should match the retrieved user address data for last name`,
        )
        .toStrictEqual(retrievedUser.last_name);
      expect
        .soft(
          updatedUser.address.company,
          `Updated user address data should match the retrieved user address data for company`,
        )
        .toStrictEqual(retrievedUser.company);
      expect
        .soft(
          updatedUser.address.addressOne,
          `Updated user address data should match the retrieved user address data for address line one`,
        )
        .toStrictEqual(retrievedUser.address1);
      expect
        .soft(
          updatedUser.address.addressTwo,
          `Updated user address data should match the retrieved user address data for address line two`,
        )
        .toStrictEqual(retrievedUser.address2);
      expect
        .soft(
          updatedUser.address.country,
          `Updated user address data should match the retrieved user address data for country`,
        )
        .toStrictEqual(retrievedUser.country);
      expect
        .soft(
          updatedUser.address.state,
          `Updated user address data should match the retrieved user address data for state`,
        )
        .toStrictEqual(retrievedUser.state);
      expect
        .soft(
          updatedUser.address.city,
          `Updated user address data should match the retrieved user address data for city`,
        )
        .toStrictEqual(retrievedUser.city);
      expect
        .soft(
          updatedUser.address.zipcode,
          `Updated user address data should match the retrieved user address data for zipcode`,
        )
        .toStrictEqual(retrievedUser.zipcode);
    });
  }

  async validateGetUser(
    response: CustomResponseType,
    user: UserType,
  ): Promise<void> {
    this.logger.debug("Validating Get User by Email.");

    await test.step("Validating Get User by Email", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Get User by Email should be 200",
        )
        .toBe(200);
      expect
        .soft(
          response.body,
          `Response body for Get User by Email should have a 'user' property`,
        )
        .toHaveProperty("user");
      expect
        .soft(
          response.body.user?.name,
          `Response body 'user' for Get User by Email should match the user details - email`,
        )
        .toStrictEqual(user.name);
      expect
        .soft(
          response.body.user?.email,
          `Response body 'user' for Get User by Email should match the user details - email`,
        )
        .toStrictEqual(user.email);
      expect
        .soft(
          response.body.user?.title,
          `Response body 'user' for Get User by Email should match the user address details - title`,
        )
        .toStrictEqual(user.address.title);
      expect
        .soft(
          response.body.user?.birth_day,
          `Response body 'user' for Get User by Email should match the user address details - birth day`,
        )
        .toStrictEqual(user.address.birthDate);
      expect
        .soft(
          response.body.user?.birth_month,
          `Response body 'user' for Get User by Email should match the user address details - birth month`,
        )
        .toStrictEqual(user.address.birthMonth);
      expect
        .soft(
          response.body.user?.birth_year,
          `Response body 'user' for Get User by Email should match the user address details - birth year`,
        )
        .toStrictEqual(user.address.birthYear);
      expect
        .soft(
          response.body.user?.first_name,
          `Response body 'user' for Get User by Email should match the user address details - first name`,
        )
        .toStrictEqual(user.address.firstname);
      expect
        .soft(
          response.body.user?.last_name,
          `Response body 'user' for Get User by Email should match the user address details - last name`,
        )
        .toStrictEqual(user.address.lastname);
      expect
        .soft(
          response.body.user?.company,
          `Response body 'user' for Get User by Email should match the user address details - company`,
        )
        .toStrictEqual(user.address.company);
      expect
        .soft(
          response.body.user?.address1,
          `Response body 'user' for Get User by Email should match the user address details - address line one`,
        )
        .toStrictEqual(user.address.addressOne);
      expect
        .soft(
          response.body.user?.address2,
          `Response body 'user' for Get User by Email should match the user address details - address line two`,
        )
        .toStrictEqual(user.address.addressTwo);
      expect
        .soft(
          response.body.user?.country,
          `Response body 'user' for Get User by Email should match the user address details - country`,
        )
        .toStrictEqual(user.address.country);
      expect
        .soft(
          response.body.user?.state,
          `Response body 'user' for Get User by Email should match the user address details - state`,
        )
        .toStrictEqual(user.address.state);
      expect
        .soft(
          response.body.user?.city,
          `Response body 'user' for Get User by Email should match the user address details - city`,
        )
        .toStrictEqual(user.address.city);
      expect
        .soft(
          response.body.user?.zipcode,
          `Response body 'user' for Get User by Email should match the user address details - zipcode`,
        )
        .toStrictEqual(user.address.zipcode);
    });
  }
}
