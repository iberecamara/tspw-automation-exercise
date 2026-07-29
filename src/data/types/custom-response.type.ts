import { BrandResponseType } from "./brand-response.type";
import { ProductResponseType } from "./product-response.type";
import { UserResponseType } from "./user-response.type";

/** Union of every shape an `automationexercise.com/api` JSON response body can take, across all endpoints this framework calls. */
export interface CustomResponseBodyType {
  responseCode: number;
  message?: string;
  products?: ProductResponseType[];
  brands?: BrandResponseType[];
  user?: UserResponseType;
}

/** The normalized shape every API client method in `apis/` returns, wrapping the raw HTTP status/text around the parsed JSON body. */
export interface CustomResponseType {
  statusCode: number;
  statusText: string;
  body: CustomResponseBodyType;
}
