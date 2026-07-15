# Typescript Vanilla Playwright Test Automation Framework — Automation Exercise

A TypeScript, vanilla [Playwright](https://playwright.dev/) end-to-end and API test automation framework built against [automationexercise.com](https://automationexercise.com). "Vanilla" means no BDD wrapper (no Cucumber/Gherkin) — the framework relies on Playwright's native test runner, fixtures, and `test.step()` calls, organized through a layered Page Object Model.

> Code created without AI help, to showcase knowledge of the Playwright framework.

**Live Allure report:** available at [iberecamara.github.io/tspw-automation-exercise](https://iberecamara.github.io/tspw-automation-exercise/) after every push/merge to `main` (see [CI/CD](#cicd)).

---

## Table of Contents

- [Project Structure](#project-structure)
  - [Architecture Overview](#architecture-overview)
  - [Layers Explained](#layers-explained)
  - [Path Aliases](#path-aliases)
- [Prerequisites](#prerequisites)
- [Cloning the Project](#cloning-the-project)
- [Installing Dependencies](#installing-dependencies)
- [Environment Configuration](#environment-configuration)
- [Running the Tests](#running-the-tests)
- [Reports](#reports)
- [Extending the Project](#extending-the-project)
  - [Adding a New Page](#adding-a-new-page)
  - [Adding a New Component](#adding-a-new-component)
  - [Adding New UI Steps](#adding-new-ui-steps)
  - [Adding a New Test](#adding-a-new-test)
  - [Adding a New API Client / API Steps](#adding-a-new-api-client--api-steps)
- [CI/CD](#cicd)
- [License](#license)

---

## Project Structure

```
src/
├── api/                # API clients (raw HTTP calls to automationexercise.com/api)
├── components/         # Reusable partial-page objects (header, subscription box, brands, categories, etc.)
├── configs/             # Playwright config, environment/.env parsing, path constants
├── data/
│   ├── constants/       # Magic strings/numbers
│   ├── model/           # TypeScript models/interfaces (UserType, ProductType, AddressType, ...)
│   └── types/           # API response and misc type shapes
├── database/             # (reserved for DB-backed test data, if/when needed)
├── exceptions/           # Custom error types
├── files/
│   ├── upload/            # Static files used for upload tests
│   └── download/          # Filepath helpers used for download tests
├── fixtures/              # Playwright fixture composition (pages, steps, api, logging)
├── global/                # Global setup/teardown hooks
├── locators/
│   ├── page/               # Raw Locator definitions for full pages, one file per page
│   └── component/          # Raw Locator definitions for shared UI fragments, one file per component
├── pages/                 # Page Object classes — one per application page
├── reporters/             # Custom Playwright reporters (e.g. Allure results cleanup)
├── steps/
│   ├── ui/                  # Business-readable UI "step" wrappers around page/component actions
│   └── api/                 # Business-readable API "step" wrappers around API clients
├── tests/
│   └── ui/                  # Spec files — what actually runs under `npm test`
└── utils/                  # Cross-cutting utilities (logger, datetime, allure, strings, arrays, numbers…)
```

### Architecture Overview

The framework follows a **layered Page Object Model** where each layer has a single responsibility, and tests are composed by combining small, reusable pieces rather than one another's internals directly:

```
tests/ui/*.spec.ts
   │  calls
   ▼
steps/ui/*.steps.ts        (readable, logged, test.step()-wrapped business actions/validations)
   │  calls                 steps/api/*.steps.ts is used the same way, but drives api/ clients
   ▼                        instead of pages/components — mainly for fast test-data setup/teardown
pages/*.page.ts             (page-level actions; may delegate to components/)
   │  composes
   ▼
components/*.component.ts    (reusable partial-page objects, e.g. Header, Subscription box)
   │  uses
   ▼
locators/page/*.locators.ts        (raw Locator definitions for whole pages)
locators/component/*.locators.ts   (raw Locator definitions for shared UI fragments)
```

Everything ultimately extends `pages/base.page.ts`, which wraps common low-level Playwright interactions (`click`, `fill`, `hover`, `checkbox`, `selectOption`, `scroll`, `goToHome`, …) so that pages and components never call `locator.click()` directly — they call `this.click(locator)`. This keeps interaction logic (waits, retries, logging hooks) centralized in one place.

### Layers Explained

#### 1. Locators (`src/locators/`)

Locators are split by scope into two folders:

- `locators/page/` — one file per full page (e.g. `home.locators.ts` exporting `HomeLocators`).
- `locators/component/` — one file per shared UI fragment (e.g. `header.locators.ts` exporting `HeaderComponentLocators`).

Each file exports a class whose constructor receives a Playwright `Page` and exposes every selector as a `readonly` property, using Playwright's built-in locator strategies (`getByRole`, `getByText`, `locator`, etc.). Locators are the **only** place where selector strings live — nothing outside this layer should contain a raw CSS/XPath/role selector.

Locators can also be exposed as functions when they're parameterized (e.g. a product card that depends on a product name, or a "logged in as X" text that depends on a username):

```ts
// src/locators/component/header.locators.ts
export class HeaderComponentLocators {
    readonly homeButton: Locator;
    readonly loggedInText: Function;

    constructor(page: Page) {
        this.homeButton = page.getByRole('link', { name: ' Home' });
        this.loggedInText = (username: string): Locator =>
            page.getByText(`Logged in as ${username}`);
    }
}
```

#### 2. Components (`src/components/`)

Components are **partial pages** — pieces of UI (like the site header/navbar, the newsletter subscription box, the categories/brands sidebar, or the product grid) that appear identically on *multiple* pages. A component:

- Extends `BasePage` (so it gets `click`, `fill`, etc.)
- Owns its own `locators` instance, sourced from `locators/component/`
- Exposes actions scoped to that piece of UI only (e.g. `clickHome()`, `clickLogout()`, `clickCart()`)

```ts
// src/components/header.component.ts
export class HeaderComponent extends BasePage {
    readonly locators: HeaderComponentLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new HeaderComponentLocators(page);
    }

    async clickCart(): Promise<void> {
        await this.click(this.locators.cartLink);
    }
    // ...
}
```

Because the header appears on virtually every page of the site, **every page object that needs it simply instantiates `HeaderComponent` in its own constructor**, instead of duplicating header locators/actions in every page:

```ts
// src/pages/home.page.ts
export class HomePage extends BasePage {
    readonly locators: HomeLocators;
    readonly header: HeaderComponent;
    readonly subscription: SubscriptionComponent;
    readonly products: ProductComponent;
    readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
    readonly categories: CategoriesComponent;
    readonly brands: BrandsComponent;

    constructor(page: Page) {
        super(page);
        this.locators = new HomeLocators(page);
        this.header = new HeaderComponent(page);
        this.subscription = new SubscriptionComponent(page);
        this.products = new ProductComponent(page);
        this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
        this.categories = new CategoriesComponent(page);
        this.brands = new BrandsComponent(page);
    }
}
```

A test then reaches into the composed component through the page object, e.g. `homePage.header.clickCart()` or `homePage.subscription.enterSubscriptionEmail(...)`. This is the key mechanism that avoids duplicating "shared UI" logic across every page class — add a component once, then compose it into every page that needs it.

#### 3. Pages (`src/pages/`)

One class per distinct application page/screen (`HomePage`, `ProductsPage`, `ProductPage`, `CartPage`, `CheckoutPage`, `SignupPage`, `BrandPage`, `CategoryPage`, …). A page object:

- Extends `BasePage`
- Owns a `locators` instance (from `locators/page/`) for elements unique to that page
- Composes any shared `components` it needs (header, subscription, etc.)
- Exposes page-specific actions and data-retrieval methods (e.g. `ProductsPage.getProducts()`, `ProductsPage.searchProducts()`)

Pages never contain assertions or `test.step()` calls — that belongs to the Steps layer.

#### 4. Steps (`src/steps/`)

Steps are the business-readable layer that tests actually call, split by concern into two folders:

- `steps/ui/` — drives `pages/`/`components/` (e.g. `HomeSteps`, `ProductsSteps`, `SharedSteps`, `CheckoutSteps`).
- `steps/api/` — drives `api/` clients directly, without going through the browser at all (e.g. `UserApiSteps`, `ProductApiSteps`), mainly used for fast test-data setup/teardown from inside UI specs (e.g. creating a user via API before a login test, or deleting it during cleanup).

Each `*.steps.ts` file groups related **actions** and **validations** as methods on a class. The step class receives its `logger: TestAutomationLogger` and its page/component/API-client dependency once, through the **constructor** (injected by the corresponding fixture) — methods themselves don't take `logger` as a parameter, they just use `this.logger`. Every step method:

- Wraps its logic in Playwright's `test.step(...)` for readable trace/report output
- Logs via `this.logger` (debug-level before/after, or info for higher-level actions)
- Uses `expect.soft(...)` for validations, so a single test can report multiple failed assertions instead of stopping at the first one

```ts
// src/steps/ui/shared.steps.ts
export class SharedSteps {
    readonly logger: TestAutomationLogger;
    readonly page: Page;

    constructor(logger: TestAutomationLogger, page: Page) {
        this.logger = logger;
        this.page = page;
    }

    async clickCart(header: HeaderComponent): Promise<void> {
        this.logger.debug('Clicking "Cart" in header');
        await test.step('Click "Cart" in header', async () => {
            await header.clickCart();
        });
        this.logger.debug('Clicked "Cart" in header');
    }
}
```

`shared.steps.ts` specifically holds UI steps that are reused across many spec files (navigation, header clicks, subscription flow, cart-adding flow), while the other `steps/ui/*.steps.ts` files hold steps specific to one page/flow (e.g. `products.steps.ts`, `checkout.steps.ts`), and `steps/api/*.steps.ts` holds the API-driven equivalents.

#### 5. Fixtures (`src/fixtures/`)

Playwright's [fixture](https://playwright.dev/docs/test-fixtures) mechanism is used to auto-inject every page, step, and API client into tests, so specs never do manual `new HomePage(page)` construction. Fixtures are split by concern and merged together:

| File | Provides |
|---|---|
| `pages.fixtures.ts` | One fixture per Page Object (`homePage`, `cartPage`, `checkoutPage`, `brandPage`, `categoryPage`, …), plus an auto-running `adblocker` route interceptor |
| `steps.fixtures.ts` | One fixture per Steps class, both UI (`homeSteps`, `sharedSteps`, `productsSteps`, …) and API (`userApiSteps`, `productApiSteps`) |
| `api.fixtures.ts` | One fixture per API client (`userApi`, `productApi`) |
| `logging.fixtures.ts` | `logger` fixture (per-worker `TestAutomationLogger`), plus `autologger`/`logError` auto-fixtures that log test start/end and dump errors |
| `fixtures.ts` | Merges all of the above via `mergeTests()` into the single `test` object every spec imports |

A spec file only ever imports `test` from `@fixtures/fixtures` and destructures whichever fixtures it needs from the test callback arguments — the injected step classes already carry their own logger internally:

```ts
test('Search Product', { tag: ['@SAMPLE-0008', '@TC9', '@products'] },
    async ({ homePage, productsSteps, productsPage, sharedSteps }) => {
        await sharedSteps.navigateHome(homePage);
        await productsSteps.searchProducts(productsPage, 'blue');
        // ...
    });
```

#### 6. Tests (`src/tests/ui/`)

Spec files (`*.spec.ts`) are intentionally thin: they read as a sequence of step calls with minimal branching logic, tagged with Jira-style IDs and feature tags (`{ tag: ['@SAMPLE-0007', '@TC8', '@products'] }`) used for filtering (`@ui`, `@api`, custom feature tags, etc.).

A `dev.spec.ts` file holds tests tagged `@dev`, used for scratch/debugging work during framework development. The default `npm test` script excludes anything tagged `@dev` (`--grep-invert @dev`); `npm run test:dev` runs only those.

#### 7. Supporting layers

- **`data/`** — `constants/` (magic strings/numbers), `model/` (TS interfaces like `UserType`, `ProductType`, `ProductCategoryType`, `AddressType`, `ContactUsType`, `CreditCardDetailsType`), and `types/` (API response shapes, site-page/title mappings).
- **`api/`** — Thin classes wrapping raw HTTP calls to `automationexercise.com/api` via Playwright's `APIRequestContext` (`UserApi`, `ProductApi`), used for fast test-data setup/teardown, e.g. creating/deleting a user without going through the UI.
- **`configs/`** — `environment.config.ts` loads and validates `.env` values with Joi and exposes them as a static `Environment` class; `playwright.config.ts` is the actual Playwright configuration; `paths.ts` centralizes filesystem paths (artifacts/reports/allure directories) so they aren't hardcoded in multiple places.
- **`utils/`** — `logger.utils.ts` (Winston-based `TestAutomationLogger`, singleton per worker), `allure.utils.ts` (`AllureUtils` class wrapping the `allure` CLI — generate/open/export/cleanup reports), plus small helpers (`datetime.utils.ts`, `string.utils.ts`, `number.utils.ts`, `arrays.utils.ts`).
- **`reporters/`** — Custom Playwright reporters, e.g. `allure-cleanup.reporter.ts`, which removes stale Allure result files matching `ALLURE_REPORT_REMOVE_STATUS` after a run.
- **`global/`** — `global.teardown.ts`, run once after the whole suite finishes (currently finalizes/splits generated logs).
- **`exceptions/`** — `TestAutomationException`, thrown by framework code when methods are misused.
- **`files/`** — Static files (e.g. `sample_file.pdf` under `files/upload/`) plus filepath helpers (`files/upload/`, `files/download/`) for tests that exercise file upload/download.
- **`database/`** — reserved for DB-backed test data, if/when needed; currently empty.

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`) instead of long relative imports:

| Alias | Resolves to |
|---|---|
| `@api/*` | `src/api/*` |
| `@components/*` | `src/components/*` |
| `@configs/*` | `src/configs/*` |
| `@data/*` | `src/data/*` |
| `@files/*` | `src/files/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@locators/*` | `src/locators/*` |
| `@pages/*` | `src/pages/*` |
| `@steps/*` | `src/steps/*` |
| `@utils/*` | `src/utils/*` |

When running via `ts-node` (e.g. the `report:*` npm scripts), these aliases are resolved at runtime through `tsconfig-paths/register`.

---

## Prerequisites

- **Node.js** (LTS recommended — the CI workflow uses `lts/*`)
- **npm** (bundled with Node.js)
- **Git**

## Cloning the Project

```bash
git clone https://github.com/iberecamara/tspw-automation-exercise.git
cd tspw-automation-exercise
```

## Installing Dependencies

Install the npm packages:

```bash
npm install
```

Then install the Playwright browser binaries (Chromium is the only configured project, but this installs all supported browsers by default):

```bash
npx playwright install
```

> On Linux you may also need OS-level dependencies: `npx playwright install-deps`

## Environment Configuration

The framework reads configuration from a `.env` file at the project root (git-ignored — you need to create your own; you can also use `.env.<APPLICATION_ENVIRONMENT>` for environment-specific overrides). At minimum:

```env
APPLICATION=Automation Exercise
JIRA_BOARD=SAMPLE
```

All variables are validated on startup via `Joi` in `src/configs/environment.config.ts` — an invalid or missing required variable (like `APPLICATION`) will throw immediately rather than fail silently later. `VIEWPORT_HEIGHT`/`VIEWPORT_WIDTH` are optional and, if omitted, Playwright uses its device default. `APPLICATION_ENVIRONMENT` defaults to `dev` and, when set, also loads a matching `.env.<APPLICATION_ENVIRONMENT>` file on top of `.env`.

## Running the Tests

All commands run through `npx playwright test` under the hood, with the configuration file pointed at `src/configs/playwright.config.ts`.

| Command | Description |
|---|---|
| `npm test` | Run the full suite, excluding anything tagged `@dev` |
| `npm run test:dev` | Run only tests tagged `@dev` (scratch/debugging specs) |
| `npm run test:retry-failed` | Re-run only the tests that failed in the last run |
| `npm run test:pwui` | Run the full suite in Playwright's interactive UI mode |
| `npm run test:ui` | Run only tests tagged `@ui` |
| `npm run test:pwui:ui` | `@ui` tests in UI mode |
| `npm run test:api` | Run only tests tagged `@api` |
| `npm run test:pwui:api` | `@api` tests in UI mode |

You can pass any additional Playwright CLI flags after `--`, e.g.:

```bash
npm test -- --project=chromium --grep "Search Product"
npm test -- --headed --workers=1
```

Tests are also filterable by any custom tag defined on them (e.g. `@products`, `@TC8`, `@SAMPLE-0007`):

```bash
npm test -- --grep "(?=.*@products)"
```

### Cleaning artifacts

```bash
npm run clean:logs      # removes artifacts/logs/*
npm run clean:reports   # removes artifacts/reports/*
npm run clean           # both of the above
```

## Reports

The suite produces three report formats simultaneously (configured in `playwright.config.ts`):

- **Playwright HTML report** → `artifacts/reports/html`
- **JSON report** → `artifacts/reports/json/report.json`
- **Allure results** → `artifacts/reports/allure/allure-results`

Allure reports are generated/opened through the `AllureUtils` class (`src/utils/allure.utils.ts`), exposed as npm scripts:

| Command | Description |
|---|---|
| `npm run report:generate` | Generates the multi-page Allure HTML report from raw results |
| `npm run report:open` | Opens the generated Allure report |
| `npm run report` | Generates and opens the report in one step |
| `npm run report:export` | Generates a single-file, portable Allure report (used by CI, uploaded as an artifact and published to GitHub Pages) |

`AllureUtils` is also usable programmatically elsewhere in the codebase:

```ts
import { AllureUtils } from '@utils/allure.utils';
await AllureUtils.generate();
```

A `AllureCleanupReporter` (`src/reporters/allure-cleanup.reporter.ts`) automatically prunes Allure result entries whose status matches `ALLURE_REPORT_REMOVE_STATUS` (comma-separated, e.g. `passed,skipped`) after every run, keeping the report focused on actionable results.

### Logs

Structured logs (via Winston) are written per worker under `artifacts/logs/`, and the global teardown (`src/global/global.teardown.ts`) finalizes/splits them at the end of a run. Set `LOG_CONSOLE=true` in `.env` to also stream logs to stdout during execution.

---

## Extending the Project

The general rule: **add the selector in `locators/page/` or `locators/component/`, add the behavior in `pages/` or `components/`, add the readable/logged wrapper in `steps/ui/` (or `steps/api/` for API-only flows), then use it from a spec in `tests/ui/`.** Never skip a layer (e.g. don't call a raw `Locator` from a spec file).

### Adding a New Page

1. **Locators** — create `src/locators/page/<page-name>.locators.ts`, exporting a class that takes `Page` in its constructor and exposes every needed `Locator` (or locator-returning function for parameterized elements).
2. **Page object** — create `src/pages/<page-name>.page.ts`, extending `BasePage`:
   ```ts
   export class MyNewPage extends BasePage {
       readonly locators: MyNewLocators;
       readonly header: HeaderComponent; // compose shared components as needed

       constructor(page: Page) {
           super(page);
           this.locators = new MyNewLocators(page);
           this.header = new HeaderComponent(page);
       }

       async doSomething(): Promise<void> {
           await this.click(this.locators.someButton);
       }
   }
   ```
3. **Register the fixture** — add it to `PageFixtures` in `src/fixtures/pages.fixtures.ts`:
   ```ts
   myNewPage: createPageFixture(MyNewPage),
   ```

### Adding a New Component

Use this when a piece of UI is shared by two or more pages (e.g. a footer, a modal, a filter sidebar).

1. **Locators** — `src/locators/component/<component-name>.locators.ts`, same pattern as page locators, class named `<ComponentName>ComponentLocators`.
2. **Component** — `src/components/<component-name>.component.ts`, extending `BasePage`, exposing only actions scoped to that UI fragment, class named `<ComponentName>Component`.
3. **Compose it** into every page object that displays it, as a `readonly` property instantiated in the constructor (see `HeaderComponent`/`SubscriptionComponent` usage in `home.page.ts`).

### Adding New UI Steps

1. Add a method to an existing `src/steps/ui/*.steps.ts` file (if it belongs to an existing flow) or create `src/steps/ui/<name>.steps.ts` exporting a class for a new flow.
2. The class constructor should accept `logger: TestAutomationLogger` plus the page/component it drives, and store both as `readonly` fields.
3. Each method should:
   - Wrap its core logic in `await test.step('<readable description>', async () => { ... })`.
   - Log a `debug` line before and after via `this.logger` (or `info` for higher-level actions).
   - For validations, use `expect.soft(...)` with a descriptive message so failures are readable in the report without halting the rest of the test.
4. If it's a new class, register it in `StepsFixtures` in `src/fixtures/steps.fixtures.ts`.

### Adding a New Test

1. Create `src/tests/ui/<feature>.spec.ts`.
2. Import `test` from `@fixtures/fixtures` (never from `@playwright/test` directly, so all custom fixtures are available).
3. Tag each test with a Jira-style ID and relevant feature tags for filtering:
   ```ts
   test('Descriptive test name', { tag: ['@SAMPLE-00XX', '@TCXX', '@feature-tag'] },
       async ({ page, homeSteps, homePage, sharedSteps /* ...whatever fixtures you need */ }) => {
           await sharedSteps.navigateHome(homePage);
           // compose steps here — the spec itself should read like a script, not contain raw Playwright calls
       });
   ```
4. Add `@ui` and/or `@api` tags (and any other custom tag you rely on for filtering) as needed.

### Adding a New API Client / API Steps

1. **Client** — create `src/api/<resource>.api.ts`, exporting a class whose constructor takes an `APIRequestContext` and exposes methods per endpoint (see `user.api.ts` / `product.api.ts` for the pattern, including simple retry handling).
2. Add any new endpoint URLs to `Environment` in `src/configs/environment.config.ts`.
3. **Register the client** in `ApiFixtures` in `src/fixtures/api.fixtures.ts`.
4. **API steps** — add a method to an existing `src/steps/api/*.steps.ts` file, or create a new one following the same `logger`-in-constructor, `test.step()`-wrapped pattern used by UI steps (see `user.steps.ts` / `product.steps.ts`). Register the class in `StepsFixtures` in `src/fixtures/steps.fixtures.ts`.

### Adding Constants / Models

- Shared magic strings/numbers go in `src/data/constants/`.
- New TypeScript interfaces describing domain entities (e.g. a new `OrderType`) go in `src/data/model/`.
- API response shapes go in `src/data/types/`.

---

## CI/CD

`.github/workflows/playwright.yml` runs on every push/PR to `main` (and manually via `workflow_dispatch`):

1. Installs dependencies and Playwright browsers (with caching).
2. Runs `npm test`.
3. Generates a single-file Allure report (`npm run report:export`).
4. Uploads the Allure report and logs as workflow artifacts.
5. Publishes the Allure report to **GitHub Pages** after the GitHub Action completes on `main`.
6. Fails the job explicitly if any test failed, even though report generation always runs first (`continue-on-error` on the test step ensures reports are produced regardless of pass/fail).

## License

See [LICENSE](./LICENSE).
