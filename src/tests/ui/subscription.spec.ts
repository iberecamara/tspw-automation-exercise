import { test } from "@fixtures/fixtures";
import { generateRandomEmail } from "@utils/string.utils";

test.describe(
  "Subscription validations - UI",
  {
    tag: ["@subscription", "@ui"],
  },
  () => {
    test(
      "Verify Subscription in home page",
      { tag: ["@SAMPLE-0005", "@TC-UI-10", "@home"] },
      async ({ homePage, commonSteps, subscriptionComponentSteps }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await commonSteps.scrolling(homePage, "down");
        await subscriptionComponentSteps.validateSubscriptionHeading(homePage);
        await subscriptionComponentSteps.subscribeEmail(
          homePage,
          generateRandomEmail(),
        );
        await subscriptionComponentSteps.validateSubscriptionMessage(homePage);
      },
    );

    test(
      "Verify Subscription in Cart page",
      { tag: ["@SAMPLE-0006", "@TC-UI-11", "@cart"] },
      async ({
        homePage,
        commonSteps,
        headerComponentSteps,
        subscriptionComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.scrolling(homePage, "down");
        await subscriptionComponentSteps.validateSubscriptionHeading(homePage);
        await subscriptionComponentSteps.subscribeEmail(
          homePage,
          generateRandomEmail(),
        );
        await subscriptionComponentSteps.validateSubscriptionMessage(homePage);
      },
    );
  },
);
