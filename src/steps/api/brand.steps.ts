import { BrandApi } from "@apis/brand.api";
import { BrandType } from "@data/model/brand.model";
import { CustomResponseType } from "@data/types/custom-response.type";
import { BaseSteps } from "@steps/ui/common/base.steps";
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
    const message = options?.raw
      ? "Retrieve raw response from Get All Brands endpoint"
      : "Retrieve All Brands from Get All Brands endpoint";
    return await this.step(message, async () => {
      return this.brandApi.all(options);
    });
  }

  // Validations
  async validateGetAllBrands(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate raw response from Get All Brands endpoint",
      () => {
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
      },
    );
  }

  async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate Method Not Allowed - PUT - Get All Brands endpoint",
      () => {
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
      },
    );
  }
}
