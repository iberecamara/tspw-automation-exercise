import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import { RUPEES } from "@data/constants/common.constants";
import { EMPTY } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { ProductResponseType } from "@data/types/product-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

/** API client for `automationexercise.com/api`'s product listing/search endpoints. */
export class ProductApi extends BaseApi {
  /**
   * Fetches every product via `{@link Environment.PRODUCT_LIST_API_URL}`.
   *
   * @param options.raw - If `true`, returns the raw HTTP status/text plus parsed JSON body
   * instead of a parsed `ProductType[]`. Useful for asserting on error/edge-case responses
   * (e.g. wrong HTTP method) rather than the happy-path product list.
   * @param options.method - HTTP method to use. Defaults to `"GET"` (the API also accepts other
   * methods, but only `GET` is expected to succeed — used with `raw: true` to assert on the
   * resulting error response).
   * @param options.brand - If set, filters the parsed result down to products matching this
   * brand. Has no effect when `raw` is `true`.
   * @returns Either the raw response ({@link CustomResponseType}, if `raw` is `true`) or every
   * (optionally brand-filtered) product, parsed into {@link ProductType}. Returns an empty array
   * if the response wasn't successful or contained no products.
   */
  async all(options?: {
    raw?: boolean;
    method?: "POST" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    const products: ProductType[] = [];
    const method = options?.method ?? "GET";
    const response: APIResponse = await this.request.fetch(
      Environment.PRODUCT_LIST_API_URL,
      { method: method },
    );
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    if (options?.raw) {
      return {
        statusCode: response.status(),
        statusText: response.statusText(),
        body: body,
      };
    }
    if (response.ok() && body.products) {
      for (const responseProduct of body.products) {
        const product = this.parseProduct(responseProduct);
        if (!options?.brand || product.brand === options.brand) {
          products.push(product);
        }
      }
    }
    return products;
  }

  /** Maps a raw {@link ProductResponseType} to the framework's {@link ProductType}, converting the price string (e.g. `"Rs. 500"`) to a plain number. */
  private parseProduct(responseProduct: ProductResponseType): ProductType {
    return {
      id: responseProduct.id,
      name: responseProduct.name,
      price: +responseProduct.price.replace(RUPEES, EMPTY),
      brand: responseProduct.brand,
      category: {
        usertype: {
          usertype: responseProduct.category.usertype.usertype,
        },
        category: responseProduct.category.category,
      },
    };
  }

  /**
   * Searches products via `POST {@link Environment.PRODUCT_SEARCH_API_URL}`.
   *
   * @param options.raw - If `true`, returns the raw HTTP status/text plus parsed JSON body
   * instead of a parsed `ProductType[]`. Useful for asserting on error/edge-case responses.
   * @param options.search - The search term. Omitted entirely from the request body if not set.
   * @returns Either the raw response ({@link CustomResponseType}, if `raw` is `true`) or every
   * matching product, parsed into {@link ProductType}. Returns an empty array if the response
   * wasn't successful or contained no products.
   */
  async search(options?: {
    raw?: boolean;
    search?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    let formData = {};
    if (options?.search) {
      formData = { search_product: options.search };
    }
    const products: ProductType[] = [];
    const response: APIResponse = await this.request.post(
      Environment.PRODUCT_SEARCH_API_URL,
      { form: formData },
    );
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    if (options?.raw) {
      return {
        statusCode: response.status(),
        statusText: response.statusText(),
        body: body,
      };
    }
    if (response.ok() && body.products) {
      for (const responseProduct of body.products) {
        const product = this.parseProduct(responseProduct);
        products.push(product);
      }
    }
    return products;
  }
}
