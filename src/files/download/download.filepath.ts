import { DOWNLOADS_DIR } from "@configs/paths";
import fs from "fs";

/**
 * Absolute path to the directory used as the destination folder for files downloaded during
 * tests (e.g. via `page.waitForEvent("download")` / `download.saveAs()`).
 *
 * Resolves to `DOWNLOADS_DIR` (under `artifacts/`) rather than this file's own directory — see
 * `DOWNLOADS_DIR`'s doc comment in `src/configs/paths.ts` for why (same-filesystem requirement
 * for `download.saveAs()` to avoid a cross-filesystem copy). Unlike `LOGS_DIR` (whose directory
 * is created implicitly by Winston's file transport), nothing else guarantees this directory
 * exists before a test tries to save into it, so it's created here, once, at import time.
 */
export const DOWNLOAD_FILEPATH = DOWNLOADS_DIR;

fs.mkdirSync(DOWNLOAD_FILEPATH, { recursive: true });