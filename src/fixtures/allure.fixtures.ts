// fixtures.ts
import { test as base } from "@playwright/test";
import * as allure from "allure-js-commons";

export const test = base.extend<{ tagProject: void }>({
  tagProject: [
    async ({}, use, testInfo) => {
      await allure.parentSuite(testInfo.project.name);
      await use();
    },
    { auto: true },
  ],
});
