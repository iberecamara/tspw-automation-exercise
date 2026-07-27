import { test } from "@fixtures/fixtures";

test.describe(
  "Home page validations - UI",
  {
    tag: ["@home", "@scroll", "@ui"],
  },
  () => {
    test(
      `Verify Scroll Up using 'Arrow' button and Scroll Down functionality`,
      { tag: ["@SAMPLE-0026", "@TC-UI-25", "@arrow-button"] },
      async ({
        homePage,
        commonSteps,
        homeSteps,
        subscriptionComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await commonSteps.scrolling(homePage, "down");
        await subscriptionComponentSteps.validateSubscriptionHeading(homePage);
        await homeSteps.scrollUp();
        await homeSteps.validateSubHeading();
      },
    );

    test(
      `Verify Scroll Up without 'Arrow' button and Scroll Down functionality`,
      { tag: ["@SAMPLE-0027", "@TC-UI-26", "@arrow-button"] },
      async ({
        homePage,
        commonSteps,
        homeSteps,
        subscriptionComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await commonSteps.scrolling(homePage, "down");
        await subscriptionComponentSteps.validateSubscriptionHeading(homePage);
        await commonSteps.scrolling(homePage, "up");
        await homeSteps.validateSubHeading();
      },
    );
  },
);
