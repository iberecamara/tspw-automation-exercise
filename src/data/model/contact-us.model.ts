import { EMPTY } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

/** Data submitted through the site's "Contact Us" form. */
export interface ContactUsType {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Path to a file to attach, or an empty string if none is attached. */
  file: string;
}

/**
 * Generates a random, internally consistent {@link ContactUsType}, with no file attached unless
 * explicitly provided.
 *
 * @param options - Overrides for any individual field; unset fields are randomly generated.
 * @returns A new, randomly generated contact form submission.
 */
export function generateRandomContactUsData(options?: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  file?: string;
}): ContactUsType {
  return {
    name: options?.name ? options.name : faker.internet.displayName(),
    email: options?.email ? options.email : faker.internet.email(),
    subject: options?.subject
      ? options.subject
      : faker.company.catchPhraseDescriptor(),
    message: options?.message
      ? options.message
      : faker.lorem.words({ min: 10, max: 30 }),
    file: options?.file ? options.file : EMPTY,
  };
}
