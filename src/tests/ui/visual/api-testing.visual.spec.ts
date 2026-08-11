import { test } from "@fixtures/fixtures";

test.describe(
  "API Testing page visual regression - UI",
  {
    tag: ["@api-testing", "@ui", "@visual"],
  },
  () => {
    test(
      "API Testing page visual regression",
      { tag: ["@SAMPLE-0047", "@TC-VISUAL-6"] },
      async ({
        commonSteps,
        headerComponentSteps,
        apiTestingPage,
        visualSteps,
      }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickApiTesting();
        await visualSteps.validatePageScreenshot(
          "API Testing",
          "api-testing-header.png",
        );
        await visualSteps.validateElementScreenshot(
          apiTestingPage.locators.mainContainer,
          "API Testing - Main container",
          "api-testing-main.png",
        );
        await visualSteps.validateElementScreenshot(
          apiTestingPage.locators.feedbackContainer,
          "API Testing - Feedback",
          "api-testing-feedback.png",
        );
        await visualSteps.validateElementScreenshot(
          apiTestingPage.footer.locators.footerContainer,
          "API Testing - Footer",
          "api-testing-footer.png",
        );
      },
    );
  },
);
