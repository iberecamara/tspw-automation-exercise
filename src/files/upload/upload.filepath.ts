import path from "path";

// Exporting from the actual folder where files to be uploaded can be found
/** Absolute path to `src/files/upload/`, the directory containing static files tests attach for upload flows (e.g. via `Locator.setInputFiles()`). */
export const UPLOAD_FILEPATH = path.resolve(__dirname);
