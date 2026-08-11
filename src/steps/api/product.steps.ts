import { ProductApi } from "@apis/product.api";
import { EMPTY } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import { CustomResponseType } from "@data/types/custom-response.type";
import { ProductResponseType } from "@data/types/product-response.type";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

/** Readable, logged steps driving {@link ProductApi}. */
export class ProductApiSteps extends BaseSteps {
  readonly productApi: ProductApi;

  constructor(productApi: ProductApi) {
    super();
    this.productApi = productApi;
  }

  // Actions

  /** Fetches every product via the API. See {@link ProductApi.all} for the `options` this forwards. */
  async all(options?: {
    raw?: boolean;
    method?: "POST" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    const message = options?.raw
      ? "Retrieve raw response from Get All Products endpoint"
      : "Retrieve all products from Get All Products endpoint";
    return await this.step(message, async () => {
      return await this.productApi.all(options);
    });
  }

  /** Searches products via the API. See {@link ProductApi.search} for the `options` this forwards. */
  async search(options?: {
    raw?: boolean;
    search?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    const message = options?.raw
      ? "Retrieve raw response from Search Products endpoint"
      : `Retrieve products from Search Products endpoint matching search '${options?.search}'.`;
    return await this.step(message, async () => {
      return await this.productApi.search(options);
    });
  }

  // Validations

  /**
   * Validates a raw "get all products" response has status `200`, a `200` body response code,
   * and a `products` array whose every entry is individually validated by
   * {@link validateIndividualProduct}.
   *
   * @param options.search - If set, also validates every product's category contains this term
   * (used when this response actually came from a search rather than the full listing).
   */
  async validateGetAllProducts(
    response: CustomResponseType,
    options?: { search?: string },
  ): Promise<void> {
    await this.step("Validate raw response from API - Get All Brands", () => {
      // Hard gate: confirms the call actually succeeded before asserting on body shape below.
      expect(
        response.statusCode,
        "Status Code (from response) for Get All Products should be 200",
      ).toBe(200);
      expect(
        response.statusText,
        `Status Text (from response) for Get All Products should be 'OK'`,
      ).toBe("OK");
      expect(
        response.body.responseCode,
        "Response Code (from body) for Get All Products should be 200",
      ).toBe(200);
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
        this.validateIndividualProduct(product, options);
      }
    });
  }

  /**
   * Validates a single raw product entry matches the expected shape (`id`, `name`, `price`,
   * `category`, `brand`), and, if `options.search` is set, that its category contains the
   * search term.
   */
  private validateIndividualProduct(
    product: ProductResponseType,
    options: { search?: string } | undefined,
  ): void {
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

  /** Validates a response for an unsupported HTTP method (`POST`) against the products endpoint has the API's `405 - method not supported` body. */
  async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate Method Not Allowed - POST - Get All Products endpoint",
      () => {
        expect(
          response.body.responseCode,
          "Response Code (from body) for POST into Get All Products should be 405",
        ).toBe(405);
        const expectedMessage = "This request method is not supported.";
        expect
          .soft(
            response.body.message,
            `Message (from body) for POST into Get All Products should be '${expectedMessage}'`,
          )
          .toBe(expectedMessage);
      },
    );
  }

  /** Validates a response for a search request missing the `search_product` parameter has the API's `400 - "...parameter is missing..."` body. */
  async validateMissingParameter(response: CustomResponseType): Promise<void> {
    await this.step(
      "Validate Missing Parameter - search_product - Search Products endpoint",
      () => {
        expect(
          response.body.responseCode,
          `Response Code (from body) for POST without 'search_product' into Search Products should be 400`,
        ).toBe(400);
        const expectedMessage =
          "Bad request, search_product parameter is missing in POST request.";
        expect
          .soft(
            response.body.message,
            `Message (from body) for POST without 'search_product' into Search Products should be '${expectedMessage}'`,
          )
          .toBe(expectedMessage);
      },
    );
  }
}
