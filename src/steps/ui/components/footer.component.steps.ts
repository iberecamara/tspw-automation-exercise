import { CartPage } from "@pages/cart.page";
import { HomePage } from "@pages/home.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";

/**
 * Readable, logged steps driving the subscription box, reached through whichever page object
 * composes it (currently {@link HomePage} or {@link CartPage}) rather than a bare
 * `SubscriptionComponent` parameter, since a page's own `subscription` property is needed to
 * reach both the component and its locators.
 */
export class FooterComponentSteps extends BaseSteps {
  // Actions

  /** Fills the subscription email input and clicks "Subscribe". */
  async subscribeEmail(
    pageObject: HomePage | CartPage,
    email: string,
  ): Promise<void> {
    this.logger.verbose(`Subscribing email in page with email '${email}'`);
    await this.step("Subscribing email in page", async () => {
      await pageObject.footer.enterSubscriptionEmail(email);
      await pageObject.footer.clickSubscribe();
    });
  }

  // Validations

  /** Validates the "Subscription" heading is displayed with the expected text. */
  async validateSubscriptionHeading(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    await this.step(
      "Validate that page have the Subscription heading",
      async () => {
        await expect
          .soft(
            pageObject.footer.locators.subscriptionHeading,
            "Subscription heading should be displayed",
          )
          .toBeVisible();
        const headingText = "Subscription";
        await expect
          .soft(
            pageObject.footer.locators.subscriptionHeading,
            `Subscription heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  /** Validates the "You have been successfully subscribed!" confirmation message is displayed with the expected text. */
  async validateSubscriptionMessage(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    await this.step(
      "Validate that the Subscription message is displayed",
      async () => {
        await expect
          .soft(
            pageObject.footer.locators.subscriptionMessage,
            "Subscription message should be displayed",
          )
          .toBeVisible();
        const message = "You have been successfully subscribed!";
        await expect
          .soft(
            pageObject.footer.locators.subscriptionMessage,
            `Subscription message should be ${message}`,
          )
          .toHaveText(message);
      },
    );
  }
}
