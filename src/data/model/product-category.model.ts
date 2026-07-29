/** A product's category, as returned by the products API — a top-level category and the user-type ("Women"/"Men"/"Kids") it's nested under. */
export interface ProductCategoryType {
  usertype: {
    usertype: string;
  };
  category: string;
}
