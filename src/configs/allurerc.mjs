import { defineConfig } from "allure";

export default defineConfig({
  name: "Playwright Allure Awesome Test Report - Automation Exercise",
  plugins: {
    awesome: {
      options: {
        groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },
  },
});
