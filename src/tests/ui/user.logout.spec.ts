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
        homePage,
        commonSteps,
        headerComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.validateLoginToAccountText();
        await signupLoginSteps.login(registeredUser);
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          registeredUser,
        );
        await headerComponentSteps.clickLogout(homePage.header);
        await commonSteps.validateTitle("Signup / Login");
      },
    );
  },
);
