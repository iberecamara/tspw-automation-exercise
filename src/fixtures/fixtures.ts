import { test as allure } from "@fixtures/allure.fixtures";
import { test as apis } from "@fixtures/apis.fixtures";
import { test as data } from "@fixtures/data.fixtures";
import { test as logging } from "@fixtures/logging.fixtures";
import { test as pages } from "@fixtures/pages.fixtures";
import { test as steps } from "@fixtures/steps.fixtures";
import { mergeTests } from "playwright/test";

/**
 * The single, fully composed `test` object every spec file imports (`import { test } from
 * "@fixtures/fixtures"`). Merges every fixture module (API clients, generated test data,
 * logging, pages, steps) into one Playwright `test`, so a spec can destructure any fixture it
 * needs from a single import without knowing which individual module provides it.
 */
export const test = mergeTests(allure, apis, data, logging, pages, steps);
