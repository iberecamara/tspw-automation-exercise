import { ProductCategoryType } from "@data/model/product-category.model";

/**
 * A product, as used across UI and API tests. Most fields are optional since different flows
 * populate different subsets — e.g. a product parsed from the product listing API only has
 * `id`/`name`/`price`/`brand`/`category`, while one read from the cart page also has
 * `quantity`/`totalPrice`.
 */
export interface ProductType {
  id?: number;
  name: string;
  price: number;
  category?: ProductCategoryType;
  /** In-stock/out-of-stock text as displayed on the product detail page. */
  availability?: string;
  /** Quantity in the cart, when read from the cart page. */
  quantity?: number;
  /** `price * quantity`, when read from the cart page. */
  totalPrice?: number;
  /** Free-text condition/description shown on the product detail page. */
  condition?: string;
  brand?: string;
}
