/** Shared magic strings/numbers reused across multiple layers of the framework. */
export const BUTTON = "button";
export const YES = "yes";
export const NO = "no";
export const SECOND_IN_MILISECONDS = 1000;
export const RUPEES = "Rs. ";
export const CATEGORY_DELIMITER = " > ";
export const PRODUCT_PREFIX = "product-";
export const CATEGORY_PREFIX = "Category: ";
export const AVAILABILITY_PREFIX = "Availability: ";
export const CONDITION_PREFIX = "Condition: ";
export const BRAND_PREFIX = "Brand: ";
export const ID = "id";

/** Countries the framework generates random users/addresses from (used by {@link generateRandomUser} via {@link getRandomElement}). */
export const VALID_COUNTRIES: string[] = [
  "India",
  "United States",
  "Canada",
  "Australia",
  "Israel",
  "New Zealand",
  "Singapore",
];

/** Titles the framework generates random users from (used by {@link generateRandomUser} via {@link getRandomElement}). */
export const VALID_TITLES: string[] = ["Mr.", "Ms."];
