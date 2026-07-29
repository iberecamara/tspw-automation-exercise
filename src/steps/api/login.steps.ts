import { LoginApi } from "@apis/login.api";
import { CustomResponseType } from "@data/types/custom-response.type";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

/** Readable, logged steps driving {@link LoginApi}. */
export class LoginApiSteps extends BaseSteps {
  readonly loginApi: LoginApi;

  constructor(loginApi: LoginApi) {
    super();
    this.loginApi = loginApi;
  }

  // Actions

  /** Verifies a login via the API. See {@link LoginApi.verify} for the `options` this forwards. */
  async verify(options?: {
    method?: "POST" | "DELETE";
    email?: string;
    password?: string;
  }): Promise<CustomResponseType> {
    return await this.step(
      "Retrieve raw response from Verify Login endpoint",
      async () => {
        return await this.loginApi.verify(options);
      },
    );
  }

  // Validations

  /** Validates a response for an existing user's credentials has the API's `200 - "User exists!"` body. */
  async validateUserExists(response: CustomResponseType): Promise<void> {
    await this.step("Validate User Exists - Verify Login endpoint", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Verify Login where user exists should be 200",
        )
        .toBe(200);
      const expectedMessage = "User exists!";
      expect
        .soft(
          response.body.message,
          `Message (from body) for Verify Login where user exists should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  /** Validates a response for non-existent credentials has the API's `404 - "User not found!"` body. */
  async validateUserNotFound(response: CustomResponseType): Promise<void> {
    await this.step("Validate User Not Found - Verify Login endpoint", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Verify Login where user does not exist should be 404",
        )
        .toBe(404);
      const expectedMessage = "User not found!";
      expect
        .soft(
          response.body.message,
          `Message (from body) for Verify Login where user does not exist should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  /** Validates a response for a request missing the email/password parameter has the API's `400 - "...parameter is missing..."` body. */
  async validateMissingParameter(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate Missing Parameter - Password - Verify Login endpoint",
      () => {
        expect
          .soft(
            response.body.responseCode,
            "Response Code (from body) for Missing Parameter - Password - Verify Login should be 400",
          )
          .toBe(400);
        const expectedMessage =
          "Bad request, email or password parameter is missing in POST request.";
        expect
          .soft(
            response.body.message,
            `Message (from body) ffor Missing Parameter - Password - Verify Login should be '${expectedMessage}'`,
          )
          .toBe(expectedMessage);
      },
    );
  }

  /** Validates a response for an unsupported HTTP method (`DELETE`) against the login endpoint has the API's `405 - method not supported` body. */
  async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate Method Not Allowed - DELETE - Verify Login endpoint",
      () => {
        expect
          .soft(
            response.body.responseCode,
            "Response Code (from body) for DELETE into Verify Login should be 405",
          )
          .toBe(405);
        const expectedMessage = "This request method is not supported.";
        expect
          .soft(
            response.body.message,
            `Message (from body) for DELETE into Verify Login should be '${expectedMessage}'`,
          )
          .toBe(expectedMessage);
      },
    );
  }
}
