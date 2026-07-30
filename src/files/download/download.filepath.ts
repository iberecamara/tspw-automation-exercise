import path from "path";

// Exporting from the actual folder where files to be downloaded can be found
/** Absolute path to `src/files/download/`, the directory containing static files tests attach for download flows. */
export const DOWNLOAD_FILEPATH = path.resolve(__dirname);
