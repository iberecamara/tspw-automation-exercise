/**
 * Shape of a single product entry as returned raw by the products API — notably, `price` is a
 * formatted string (e.g. `"Rs. 500"`), not a number; {@link ProductApi} converts it to
 * {@link ProductType.price} on parse.
 */
export interface ProductResponseType {
  id: number;
  name: string;
  price: string;
  category: { usertype: { usertype: string }; category: string };
  brand: string;
}
