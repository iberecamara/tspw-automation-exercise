import path from "node:path";

export const ROOT_DIR = path.resolve(__dirname, "..", "..");

export const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts");

export const LOGS_DIR = path.join(ARTIFACTS_DIR, "logs");

export const REPORTS_DIR = path.join(ARTIFACTS_DIR, "reports");
export const ALLURE_DIR = path.join(REPORTS_DIR, "allure");

export const ALLURE_RESULTS_DIR = path.join(ALLURE_DIR, "allure-results");
export const ALLURE_REPORT_DIR = path.join(ALLURE_DIR, "allure-report");
export const ALLURE_REPORT_SINGLE_FILE_DIR = path.join(
    ALLURE_DIR,
    "allure-report-single"
);

export const PATHS = {
    ROOT_DIR,
    ARTIFACTS_DIR,
    LOGS_DIR,
    REPORTS_DIR,
    ALLURE_DIR,
    ALLURE_RESULTS_DIR,
    ALLURE_REPORT_DIR,
    ALLURE_REPORT_SINGLE_FILE_DIR,
} as const;