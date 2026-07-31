import { SECOND_IN_MILISECONDS } from "@data/constants/constants";
import { SitePages } from "@data/types/site-pages.type";
import { BaseSteps } from "@steps/base.steps";
import * as allure from "allure-js-commons";
import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export class VisualSteps extends BaseSteps {
  readonly page: Page;
  private readonly visualTimeoutConfig = {
    timeout: 15 * SECOND_IN_MILISECONDS, // Applied specifically to the screenshot loop
  };

  constructor(page: Page) {
    super();
    this.page = page;
  }

  async validatePageScreenshot(
    webPage: SitePages,
    screenshot: string,
  ): Promise<void> {
    await this.step(`Validate visual regression for ${webPage}`, async () => {
      await this.page.waitForLoadState('networkidle');
      await expect(
        this.page,
        `${webPage} screenshot should match existing one '${screenshot}'.`,
      ).toHaveScreenshot(screenshot, this.visualTimeoutConfig);
      const visualBuffer = await this.page.screenshot();
      await allure.attachment(
        `${webPage} visual check success`,
        visualBuffer,
        "image/png",
      );
    });
  }

  async validateElementScreenshot(
    element: Locator,
    elementName: string,
    screenshot: string,
  ): Promise<void> {
    await this.step(
      `Validate visual regression for ${elementName} element`,
      async () => {
        await this.page.waitForLoadState('networkidle');
        await element.scrollIntoViewIfNeeded();
        await expect(
          element,
          `${elementName} element screenshot should match existing one '${screenshot}'.`,
        ).toHaveScreenshot(screenshot, this.visualTimeoutConfig);
        const visualBuffer = await element.screenshot();
        await allure.attachment(
          `${elementName} visual check success`,
          visualBuffer,
          "image/png",
        );
      },
    );
  }
}
