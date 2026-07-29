import { generateRandomUser, UserType } from "@data/model/user.model";
import { test as steps } from "@fixtures/steps.fixtures";

/** Ready-to-use, randomly generated test users, created/cleaned up automatically per test. */
interface TestDataFixtures {
  registeredUser: UserType;
  unregisteredUser: UserType;
}

/**
 * Extends the steps fixture set with two randomly generated user fixtures, both cleaned up via
 * the API after the test regardless of what happened during it:
 * - `registeredUser` — created via the API before the test runs, so the test can start from an
 *   already-registered account (e.g. to test login).
 * - `unregisteredUser` — generated but never created, so the test can drive registration itself
 *   (e.g. to test the signup flow) while still getting automatic cleanup afterwards.
 */
export const test = steps.extend<TestDataFixtures>({
  registeredUser: async ({ userApiSteps }, use) => {
    const user = generateRandomUser();
    await userApiSteps.createAccount(user);
    await use(user);
    await userApiSteps.deleteAccount(user);
  },
  unregisteredUser: async ({ userApiSteps }, use) => {
    const user = generateRandomUser();
    await use(user);
    await userApiSteps.deleteAccount(user);
  },
});
