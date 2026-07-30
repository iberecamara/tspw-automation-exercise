import { test } from "@fixtures/fixtures";

test.describe(
  "Test Cases page validations - UI",
  {
    tag: ["@test-cases", "@ui"],
  },
  () => {
    test(
      "Verify Test Cases Page",
      { tag: ["@SAMPLE-0004", "@TC-UI-7"] },
      async ({ commonSteps, headerComponentSteps }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickTestCases();
        await commonSteps.validateTitle("Test Cases");
      },
    );
  },
);
