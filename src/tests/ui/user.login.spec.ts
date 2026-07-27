import { test } from "@fixtures/fixtures";

test.describe(
  "User login validations - UI",
  {
    tag: ["@user-login", "@ui"],
  },
  () => {
    test(
      "Login User with correct email and password",
      { tag: ["@SAMPLE-0001", "@TC-UI-2", "@valid-user"] },
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
      },
    );

    test(
      "Login User with incorrect email",
      {
        tag: [
          "@SAMPLE-0002",
          "@TC-UI-3",
          "@TC-UI-3.1",
          "@login-error",
          "@invalid-user",
        ],
      },
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
        const email = registeredUser.email;
        registeredUser.email = `invalid_${registeredUser.email}`;
        await signupLoginSteps.login(registeredUser);
        await signupLoginSteps.validateInvalidCredentialsMessage();
        registeredUser.email = email;
      },
    );

    test(
      "Login User with incorrect password",
      { tag: ["@SAMPLE-0003", "@TC-UI-3", "@TC-UI-3.2", "@invalid-password"] },
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
        const password = registeredUser.password;
        registeredUser.password = `invalid_${registeredUser.password}`;
        await signupLoginSteps.login(registeredUser);
        await signupLoginSteps.validateInvalidCredentialsMessage();
        registeredUser.password = password;
      },
    );
  },
);
