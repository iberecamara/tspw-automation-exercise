import { test } from "@fixtures/fixtures";

test.describe(
  "Signup / Login page visual regression - UI",
  {
    tag: ["@signup", "@login", "@ui", "@visual"],
  },
  () => {
    test(
      "Signup / Login page visual regression",
      { tag: ["@SAMPLE-0045", "@TC-VISUAL-4"] },
      async ({
        commonSteps,
        headerComponentSteps,
        signupLoginPage,
        visualSteps,
      }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickSignupLogin();
        await visualSteps.validatePageScreenshot(
          "Signup / Login",
          "signup-login-header.png",
        );
        await visualSteps.validateElementScreenshot(
          signupLoginPage.locators.loginForm,
          "Signup / Login - Login Form",
          "signup-login-login-form.png",
        );
        await visualSteps.validateElementScreenshot(
          signupLoginPage.locators.signupForm,
          "Signup / Login - Signup Form",
          "signup-login-signup-form.png",
        );
        await visualSteps.validateElementScreenshot(
          signupLoginPage.footer.locators.footerContainer,
          "Signup / Login - Footer",
          "signup-login-footer.png",
        );
      },
    );
  },
);
