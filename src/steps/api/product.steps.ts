import { ProductApi } from "@api/product.api";
import { EMPTY } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import { CustomResponseType } from "@data/types/custom-response.type";
import { test } from "@fixtures/fixtures";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

export class ProductApiSteps extends BaseSteps {
  readonly productApi: ProductApi;

  constructor(productApi: ProductApi) {
    super();
    this.productApi = productApi;
  }

  // Actions
  async all(options?: {
    raw?: boolean;
    method?: "POST" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    if (options?.raw) {
      this.logger.verbose("Retrieving raw response from API - Get All Products.");
      let response = {} as CustomResponseType;

      await test.step("Retrieve raw response from API - Get All Products", async () => {
        response = (await this.productApi.all(options)) as CustomResponseType;
      });

      this.logger.verbose("Retrieved raw response from API - Get All Products.");
      return response;
    }
    this.logger.verbose("Retrieving all products from API.");
    const products: ProductType[] = [];

    await test.step("Retrieve all products from API", async () => {
      products.push(...((await this.productApi.all(options)) as ProductType[]));
    });

    this.logger.verbose(
      `Retrieved ${products.length} product${products.length > 1 ? "s" : EMPTY} from API.`,
    );
    return products;
  }

  async search(options?: {
    raw?: boolean;
    search?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    if (options?.raw) {
      this.logger.verbose("Retrieving raw response from API - Search Products.");
      let response = {} as CustomResponseType;

      await test.step("Retrieve raw response from API - Search Products", async () => {
        response = (await this.productApi.search(
          options,
        )) as CustomResponseType;
      });

      this.logger.verbose("Retrieved raw response from API - Search Products.");
      return response;
    }
    this.logger.verbose(
      `Retrieving products from API matching search '${options?.search}'.`,
    );
    const products: ProductType[] = [];

    await test.step("Retrieving products from API matching search", async () => {
      products.push(
        ...((await this.productApi.search(options)) as ProductType[]),
      );
    });

    this.logger.verbose(
      `Retrieved ${products.length} product${products.length > 1 ? "s" : EMPTY} from API matching search '${options?.search}'.`,
    );
    return products;
  }

  // Validations
  async validateGetAllProducts(
    response: CustomResponseType,
    options?: { search?: string },
  ): Promise<void> {
    this.logger.verbose("Validating raw response from API - Get All Products.");

    await test.step("Validate raw response from API - Get All Products", () => {
      expect
        .soft(
          response.statusCode,
          "Status Code (from response) for Get All Products should be 200",
        )
        .toBe(200);
      expect
        .soft(
          response.statusText,
          `Status Text (from response) for Get All Products should be 'OK'`,
        )
        .toBe("OK");
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for Get All Products should be 200",
        )
        .toBe(200);
      expect
        .soft(
          response.body,
          `Response body for Get All Products should be have a 'products' field`,
        )
        .toHaveProperty("products");
      expect
        .soft(
          response.body.products,
          `Response body 'products' field for Get All Products should be an array`,
        )
        .toBeInstanceOf(Array);
      const { products = [] } = response.body;
      for (const product of products) {
        expect
          .soft(
            product,
            `Response body 'products' objects for Get All Products should have the expected properties`,
          )
          .toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(String),
            category: {
              usertype: {
                usertype: expect.any(String),
              },
              category: expect.any(String),
            },
            brand: expect.any(String),
          });
        const hasSearchTerm =
          !options?.search ||
          product.category?.category
            .toLowerCase()
            .includes(options.search.toLowerCase());
        expect
          .soft(
            hasSearchTerm,
            `Response body 'products' objects for Get All Products should have the expected search term '${options?.search ?? EMPTY}'`,
          )
          .toBe(true);
      }
    });
  }

  async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
    this.logger.verbose(
      "Validating Method Not Allowed - POST - Get All Products.",
    );

    await test.step("Validating Method Not Allowed - POST - Get All Products", () => {
      expect
        .soft(
          response.body.responseCode,
          "Response Code (from body) for POST into Get All Products should be 405",
        )
        .toBe(405);
      const expectedMessage = "This request method is not supported.";
      expect
        .soft(
          response.body.message,
          `Message (from body) for POST into Get All Products should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }

  async validateMissingParameter(response: CustomResponseType): Promise<void> {
    this.logger.verbose(
      "Validating Missing Paramater - search_product - Search Products.",
    );

    await test.step("Validating Missing Paramater - search_product - Search Products", () => {
      expect
        .soft(
          response.body.responseCode,
          `Response Code (from body) for POST without 'search_product' into Search Products should be 400`,
        )
        .toBe(400);
      const expectedMessage =
        "Bad request, search_product parameter is missing in POST request.";
      expect
        .soft(
          response.body.message,
          `Message (from body) for POST without 'search_product' into Search Products should be '${expectedMessage}'`,
        )
        .toBe(expectedMessage);
    });
  }
}
