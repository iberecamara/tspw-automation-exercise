import { test } from "@fixtures/fixtures";

test.describe(
  "Test Cases page visual regression - UI",
  {
    tag: ["@test-cases", "@ui", "@visual"],
  },
  () => {
    test(
      "Test Cases page visual regression",
      { tag: ["@SAMPLE-0046", "@TC-VISUAL-5"] },
      async ({
        commonSteps,
        headerComponentSteps,
        testCasesPage,
        visualSteps,
      }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickTestCases();
        await visualSteps.validatePageScreenshot(
          "Test Cases",
          "test-cases-header.png",
        );
        await visualSteps.validateElementScreenshot(
          testCasesPage.locators.mainContainer,
          "Test Cases - Main container",
          "test-cases-main.png",
        );
        await visualSteps.validateElementScreenshot(
          testCasesPage.locators.feedbackContainer,
          "Test Cases - Feedback",
          "test-cases-feedback.png",
        );
        await visualSteps.validateElementScreenshot(
          testCasesPage.footer.locators.footerContainer,
          "Test Cases - Footer",
          "test-cases-footer.png",
        );
      },
    );
  },
);
