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
      async ({ homePage, commonSteps, footerComponentSteps }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await commonSteps.scrolling(homePage, "down");
        await footerComponentSteps.validateSubscriptionHeading(homePage);
        await footerComponentSteps.subscribeEmail(
          homePage,
          generateRandomEmail(),
        );
        await footerComponentSteps.validateSubscriptionMessage(homePage);
      },
    );

    test(
      "Verify Subscription in Cart page",
      { tag: ["@SAMPLE-0006", "@TC-UI-11", "@cart"] },
      async ({
        homePage,
        commonSteps,
        headerComponentSteps,
        footerComponentSteps,
      }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickCart();
        await commonSteps.scrolling(homePage, "down");
        await footerComponentSteps.validateSubscriptionHeading(homePage);
        await footerComponentSteps.subscribeEmail(
          homePage,
          generateRandomEmail(),
        );
        await footerComponentSteps.validateSubscriptionMessage(homePage);
      },
    );
  },
);
