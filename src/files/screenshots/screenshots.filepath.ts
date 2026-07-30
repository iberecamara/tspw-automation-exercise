import path from "path";

// Exporting from the actual folder where files used for visual regression can be found
/** Absolute path to `src/files/screenshots/`, the directory containing static files visual regression tests. */
export const SCREENSHOTS_FILEPATH = path.resolve(__dirname);
