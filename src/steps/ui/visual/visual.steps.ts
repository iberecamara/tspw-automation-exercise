import { SECOND_IN_MILLISECONDS } from "@data/constants/constants";
import { SitePages } from "@data/types/site-pages.type";
import { BaseSteps } from "@steps/base.steps";
import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export class VisualSteps extends BaseSteps {
  readonly page: Page;
  private readonly visualTimeoutConfig = {
    timeout: 15 * SECOND_IN_MILLISECONDS,
  };

  constructor(page: Page) {
    super();
    this.page = page;
  }

  private async waitPageToBeStable(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.evaluate(() => document.fonts.ready);
  }


  async validatePageScreenshot(
    webPage: SitePages,
    screenshot: string,
  ): Promise<void> {
    await this.step(`Validate visual regression for ${webPage}`, async () => {
      await this.waitPageToBeStable();
      await expect(
        this.page,
        `${webPage} screenshot should match existing one '${screenshot}'.`,
      ).toHaveScreenshot(screenshot, this.visualTimeoutConfig);
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
        await element.scrollIntoViewIfNeeded();
        await this.waitPageToBeStable();
        await expect(
          element,
          `${elementName} element screenshot should match existing one '${screenshot}'.`,
        ).toHaveScreenshot(screenshot, this.visualTimeoutConfig);
      },
    );
  }
}
