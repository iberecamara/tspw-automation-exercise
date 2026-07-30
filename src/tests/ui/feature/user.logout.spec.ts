import { test } from "@fixtures/fixtures";

test.describe(
  "User logout validations - UI",
  {
    tag: ["@user-logout", "@ui"],
  },
  () => {
    test(
      "Logout User",
      { tag: ["@SAMPLE-0012", "@TC-UI-4"] },
      async ({
        registeredUser,
        signupLoginSteps,
        commonSteps,
        headerComponentSteps,
      }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin();
        await signupLoginSteps.validateLoginToAccountText();
        await signupLoginSteps.login(registeredUser);
        await headerComponentSteps.validateUserLoggedText(registeredUser);
        await headerComponentSteps.clickLogout();
        await commonSteps.validateTitle("Signup / Login");
      },
    );
  },
);
