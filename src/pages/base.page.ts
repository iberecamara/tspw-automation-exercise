import { SECOND_IN_MILISECONDS } from "@data/constants/common.constants";
import { Locator, Page } from "@playwright/test";

/**
 * Base class every page object and component in the framework extends.
 *
 * Wraps Playwright's low-level `Locator`/`Page` interactions (`click`, `fill`, `hover`,
 * `checkbox`, `selectOption`, `scroll`, `goToHome`) so that pages and components never call
 * `locator.click()` (or similar) directly — they call `this.click(locator)` instead. This keeps
 * interaction logic centralized in one place, so waits, retries, or logging hooks can be added
 * here later without touching every page/component that performs an interaction.
 */
export class BasePage {
  /** The Playwright `Page` this page object/component operates against. */
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the application's home page, relative to the configured `baseURL`
   * (`Environment.BASE_URL`, wired into `playwright.config.ts`'s `use.baseURL`).
   *
   * @param options - Optional navigation overrides, forwarded to `page.goto()`. Defaults to a
   * 30-second timeout unless overridden.
   */
  async goToHome(options?: {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }): Promise<void> {
    await this.page.goto("/", {
      timeout: 30 * SECOND_IN_MILISECONDS,
      ...options,
    });
  }

  /**
   * Clicks the given locator.
   *
   * @param locator - The element to click.
   * @param options - Optional click behavior, forwarded to `Locator.click()`.
   */
  async click(
    locator: Locator,
    options?: {
      button?: "left" | "right" | "middle";
      clickCount?: number;
      delay?: number;
      force?: boolean;
      modifiers?: ("Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift")[];
      position?: { x: number; y: number };
      steps?: number;
      timeout?: number;
      trial?: boolean;
    },
  ): Promise<void> {
    await locator.click(options);
  }

  /**
   * Checks or unchecks the given checkbox/radio locator.
   *
   * @param locator - The checkbox/radio element to set.
   * @param checked - `true` to check the element, `false` to uncheck it.
   * @param options - Optional behavior, forwarded to `Locator.check()`/`Locator.uncheck()`.
   */
  async checkbox(
    locator: Locator,
    checked: boolean,
    options?: {
      force?: boolean;
      position?: { x: number; y: number };
      trial?: boolean;
    },
  ): Promise<void> {
    if (checked) {
      await locator.check(options);
    } else {
      await locator.uncheck(options);
    }
  }

  /**
   * Fills a text input/textarea locator with the given text.
   *
   * @param locator - The input/textarea element to fill.
   * @param text - The text to enter.
   * @param options - Optional behavior, forwarded to `Locator.fill()`.
   */
  async fill(
    locator: Locator,
    text: string,
    options?: {
      force?: boolean;
      timeout?: number;
    },
  ): Promise<void> {
    await locator.fill(text, options);
  }

  /**
   * Selects an option in a `<select>` locator.
   *
   * @param locator - The `<select>` element.
   * @param option - The value/label of the option to select.
   * @param options - Optional behavior, forwarded to `Locator.selectOption()`.
   */
  async selectOption(
    locator: Locator,
    option: string,
    options?: {
      force?: boolean;
      timeout: number;
    },
  ): Promise<void> {
    await locator.selectOption(option, options);
  }

  /**
   * Hovers the mouse over the given locator.
   *
   * @param locator - The element to hover.
   * @param options - Optional hover behavior, forwarded to `Locator.hover()`.
   */
  async hover(
    locator: Locator,
    options?: {
      force?: boolean;
      modifiers?: ("Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift")[];
      position?: { x: number; y: number };
      timeout: number;
      trial?: boolean;
    },
  ): Promise<void> {
    await locator.hover(options);
  }

  /**
   * Smoothly scrolls the page from one end to the other, a small increment at a time, by
   * evaluating a scroll loop in the browser context. Used where an application relies on
   * scroll-triggered lazy loading/animations that a single instant `scrollTo` wouldn't trigger.
   *
   * @param direction - `"down"` scrolls from the top to the bottom of the page; `"up"` scrolls
   * from the bottom to the top.
   */
  async scroll(direction: "down" | "up") {
    const scroller = async (direction: string) => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const scrollHeight = () => document.body.scrollHeight;
      const start = direction === "down" ? 0 : scrollHeight();
      const shouldStop = (position: number) =>
        direction === "down" ? position > scrollHeight() : position < 0;
      const increment = direction === "down" ? 100 : -100;
      for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i);
        await delay(5);
      }
    };
    await this.page.evaluate(scroller, direction);
  }
}
