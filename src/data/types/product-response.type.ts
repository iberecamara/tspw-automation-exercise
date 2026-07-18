export interface ProductResponseType {
  id: number;
  name: string;
  price: string;
  category: { usertype: { usertype: string }; category: string };
  brand: string;
}
