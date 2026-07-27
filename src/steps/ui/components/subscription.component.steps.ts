import { CartPage } from "@pages/cart.page";
import { HomePage } from "@pages/home.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class SubscriptionComponentSteps extends BaseSteps {
  // Actions
  async subscribeEmail(
    pageObject: HomePage | CartPage,
    email: string,
  ): Promise<void> {
    this.logger.verbose(`Subscribing email in page with email '${email}'`);
    await this.step("Subscribing email in page", async () => {
      await pageObject.subscription.enterSubscriptionEmail(email);
      await pageObject.subscription.clickSubscribe();
    });
  }

  // Validations
  async validateSubscriptionHeading(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    await this.step(
      "Validate that page have the Subscription heading",
      async () => {
        await expect
          .soft(
            pageObject.subscription.locators.subscriptionHeading,
            "Subscription heading should be displayed",
          )
          .toBeVisible();
        const headingText = "Subscription";
        await expect
          .soft(
            pageObject.subscription.locators.subscriptionHeading,
            `Subscription heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  async validateSubscriptionMessage(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    await this.step(
      "Validate that the Subscription message is displayed",
      async () => {
        await expect
          .soft(
            pageObject.subscription.locators.subscriptionMessage,
            "Subscription message should be displayed",
          )
          .toBeVisible();
        const message = "You have been successfully subscribed!";
        await expect
          .soft(
            pageObject.subscription.locators.subscriptionMessage,
            `Subscription message should be ${message}`,
          )
          .toHaveText(message);
      },
    );
  }
}
