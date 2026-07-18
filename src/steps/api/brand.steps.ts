import { BrandApi } from "@api/brand.api";
import { EMPTY } from "@data/constants/string.constants";
import { BrandType } from "@data/model/brand.model";
import { CustomResponseType } from "@data/types/custom-response.type";
import { test } from "@fixtures/fixtures";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

export class BrandApiSteps extends BaseSteps {
  readonly brandApi: BrandApi;

  constructor(brandApi: BrandApi) {
    super();
    this.brandApi = brandApi;
  }

  // Actions
  async getAllBrands(options?: {
    raw?: boolean;
    method?: "PUT" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | BrandType[]> {
    if (options?.raw) {
      this.logger.debug("Retrieving raw response from API - Get All Brands.");
      let response = {} as CustomResponseType;

      await test.step("Retrieve raw response from API - Get All Brands", async () => {
        response = (await this.brandApi.all(options)) as CustomResponseType;
      });

      this.logger.debug("Retrieved raw response from API - Get All Brands.");
      return response;
    }
    this.logger.debug("Retrieving all brands from API.");
    const brands: BrandType[] = [];

    await test.step("Retrieve all brands from API.", async () => {
      brands.push(...((await this.brandApi.all(options)) as BrandType[]));
    });

    this.logger.debug(
      `Retrieved ${brands.length} brands${brands.length > 1 ? "s" : EMPTY} from API.`,
    );
    return brands;
  }

  // Validations
  async validateGetAllBrands(response: CustomResponseType): Promise<void> {
    this.logger.debug("Validating raw response from API - Get All Brands.");

    await test.step("Validate raw response from API - Get All Brands", () => {
      expect
        .soft(
          response.statusCode,
          "Status Code (from response) for Get All Brands should be 200",
        )
        .toBe(200);
      expect
        .soft(
          response.statusText,
          `Status Text (from response) for Get All Brands should be 'OK'`,
        )
        .toBe("OK");
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Get All Brands should be 200",
        )
        .toBe(200);
      expect
        .soft(
          response.body,
          `Response body for Get All Brands should be have a 'brands' field`,
        )
        .toHaveProperty("brands");
      expect
        .soft(
          response.body.brands,
          `Response body 'brands' field for Get All Brands should be an array`,
        )
        .toBeInstanceOf(Array);
      const { brands = [] } = response.body;
      for (const product of brands) {
        expect
          .soft(
            product,
            `Response body 'brands' objects for Get All Brands should have the expected properties`,
          )
          .toMatchObject({
            id: expect.any(Number),
            brand: expect.any(String),
          });
      }
    });
  }

  async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
    this.logger.debug("Validating Method Not Allowed - PUT - Get All Brands.");

    await test.step("Validating Method Not Allowed - PUT - Get All Brands", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for PUT into Get All Brands should be 405",
        )
        .toBe(405);
      const expectedMessage = "This request method is not supported.";
      expect
        .soft(
          response.body.message,
          `Message (from body) for PUT into Get All Brands should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }
}
