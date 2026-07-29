/** Every distinct page title the framework validates against (e.g. via `CommonSteps.validateTitle`). */
export type SitePages =
  | "Home"
  | "Cart"
  | "Product"
  | "Products"
  | "Test Cases"
  | "Contact Us"
  | "Signup / Login";

/** Maps each {@link SitePages} entry to its expected `<title>` text on that page. */
export type SitePagesTitles = Record<SitePages, string>;
