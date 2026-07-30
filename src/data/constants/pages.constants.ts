import { SitePagesTitles } from "@data/types/site-pages.type";

/** Expected `<title>` text for every page the framework navigates to, used by `CommonSteps.validateTitle` to assert the browser landed on the right page. */
export const PAGES_TITLES: SitePagesTitles = {
  Home: "Automation Exercise",
  Cart: "Automation Exercise - Checkout",
  Product: "Automation Exercise - Product Details",
  Products: "Automation Exercise - All Products",
  "Test Cases": "Automation Practice Website for UI Testing - Test Cases",
  "API Testing": "Automation Practice for API Testing",
  "Contact Us": "Automation Exercise - Contact Us",
  "Signup / Login": "Automation Exercise - Signup / Login",
};
