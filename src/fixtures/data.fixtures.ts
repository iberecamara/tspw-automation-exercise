import { generateRandomUser, UserType } from "@data/model/user.model";
import { test as steps } from "@fixtures/steps.fixtures";

interface TestDataFixtures {
  registeredUser: UserType;
  unregisteredUser: UserType;
}

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
