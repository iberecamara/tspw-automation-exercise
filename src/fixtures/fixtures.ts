import { test as apis } from "@fixtures/apis.fixtures";
import { test as data } from "@fixtures/data.fixtures";
import { test as logging } from "@fixtures/logging.fixtures";
import { test as pages } from "@fixtures/pages.fixtures";
import { test as steps } from "@fixtures/steps.fixtures";
import { mergeTests } from "playwright/test";

export const test = mergeTests(apis, data, logging, pages, steps);
