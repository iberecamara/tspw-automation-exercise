import { EMPTY } from "@data/constants/string.constants";
import { faker } from "@faker-js/faker";

export interface ContactUsType {
  name: string;
  email: string;
  subject: string;
  message: string;
  file: string;
}

export function GenerateRandomContactUsData(options?: {
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
