import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import { BrandType } from "@data/model/brand.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

/** API client for `automationexercise.com/api`'s brand listing endpoint. */
export class BrandApi extends BaseApi {
  /**
   * Fetches every brand via `{@link Environment.BRAND_LIST_API_URL}`.
   *
   * @param options.raw - If `true`, returns the raw HTTP status/text plus parsed JSON body
   * instead of a parsed `BrandType[]`. Useful for asserting on error/edge-case responses (e.g.
   * wrong HTTP method) rather than the happy-path brand list.
   * @param options.method - HTTP method to use. Defaults to `"GET"` (the API also accepts other
   * methods, but only `GET` is expected to succeed — used with `raw: true` to assert on the
   * resulting error response).
   * @param options.brand - Currently unused by this method; reserved for parity with
   * {@link ProductApi.all}'s brand-filtering option.
   * @returns Either the raw response ({@link CustomResponseType}, if `raw` is `true`) or every
   * brand, parsed into {@link BrandType}. Returns an empty array if the response wasn't
   * successful or contained no products.
   */
  async all(options?: {
    raw?: boolean;
    method?: "PUT" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | BrandType[]> {
    const brands: BrandType[] = [];
    const method = options?.method ?? "GET";
    const response: APIResponse = await this.request.fetch(
      Environment.BRAND_LIST_API_URL,
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
        const brand = {
          id: responseProduct.id,
          brand: responseProduct.brand,
        };
        brands.push(brand);
      }
    }
    return brands;
  }
}
