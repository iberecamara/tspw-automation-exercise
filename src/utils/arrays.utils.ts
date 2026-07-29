import { TestAutomationException } from "@exceptions/test-automation.exception";
import { faker } from "@faker-js/faker";

/**
 * Picks a given quantity of distinct, random elements from an array, without replacement.
 *
 * @param array - The array to pick from.
 * @param options.quantity - How many elements to pick. Defaults to `1`.
 * @param options.indexLimit - If set, only picks from the first `indexLimit` elements of `array`.
 * @param options.exclude - Elements to never pick, even if present in `array`.
 * @returns An array of `quantity` distinct elements, in random order.
 * @throws {TestAutomationException} If `array` is empty, if `quantity`/`indexLimit` are inconsistent with the
 * array's length, or if there aren't enough non-excluded elements to satisfy `quantity`.
 */
export function getRandomElements<T>(
  array: T[],
  options?: { quantity?: number; indexLimit?: number; exclude?: T[] },
): T[] {
  const amount = options?.quantity ?? 1;

  if (array.length === 0) {
    throw new TestAutomationException("Array cannot be empty");
  }

  if (amount > array.length) {
    throw new TestAutomationException("Amount cannot be greater than the array length");
  }

  if (options?.indexLimit && options?.indexLimit > array.length) {
    throw new TestAutomationException("Index limit cannot be greater than the array length");
  }

  if (options?.indexLimit && options?.indexLimit < amount) {
    throw new TestAutomationException("Amount cannot be lower than the index limit");
  }

  if (options?.indexLimit) {
    array = array.slice(0, options.indexLimit);
  }

  if (options?.exclude) {
    const available = array.filter(
      (element) => !options?.exclude?.includes(element),
    );
    if (amount > available.length) {
      throw new TestAutomationException(
        "Requested amount exceeds available non-excluded elements",
      );
    }
  }

  const elements: T[] = [];
  const usedIndices = new Set<number>();

  while (elements.length < amount) {
    const randomIndex = faker.number.int({ min: 0, max: array.length - 1 });
    const element = array[randomIndex];

    if (element === undefined) {
      throw new TestAutomationException(
        `Unexpected undefined element at index ${randomIndex} while selecting random elements.`,
      );
    }

    if (!usedIndices.has(randomIndex) && !options?.exclude?.includes(element)) {
      usedIndices.add(randomIndex);
      elements.push(element);
    }
  }

  return elements;
}

/**
 * Picks a single random element from an array. Thin convenience wrapper around
 * {@link getRandomElements} for the common single-element case.
 *
 * @param array - The array to pick from.
 * @param options.exclude - Elements to never pick, even if present in `array`.
 * @returns A single random element from `array`.
 * @throws {TestAutomationException} If `array` is empty or every element is excluded.
 */
export function getRandomElement<T>(
  array: T[],
  options?: { exclude?: T[] },
): T {
  const [element] = getRandomElements(array, {
    exclude: options?.exclude,
  });

  if (element === undefined) {
    throw new TestAutomationException(
      "getRandomElements() unexpectedly returned an empty array.",
    );
  }

  return element;
}
