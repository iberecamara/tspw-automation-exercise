export type SitePages =
  | "Home"
  | "Cart"
  | "Product"
  | "Products"
  | "Test Cases"
  | "Contact Us"
  | "Signup / Login";

export type SitePagesTitles = {
  [K in SitePages]: string;
};
