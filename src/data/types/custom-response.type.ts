import { BrandResponseType } from "./brand-response.type";
import { ProductResponseType } from "./product-response.type";
import { UserResponseType } from "./user-response.type";

export interface CustomResponseBodyType {
  responseCode: number;
  message?: string;
  products?: ProductResponseType[];
  brands?: BrandResponseType[];
  user?: UserResponseType;
}

export interface CustomResponseType {
  statusCode: number;
  statusText: string;
  body: CustomResponseBodyType;
}
