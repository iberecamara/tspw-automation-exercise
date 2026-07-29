import { EMPTY } from "@data/constants/string.constants";

/**
 * Returns the current date/time (UTC), zero-padded, as three related string representations.
 *
 * @param options.fileFormat - If `true` (and `onlyNumbers` is falsy), separates `date` and
 * `time` with `_` and replaces `:` with `-` in `datetime`, producing a filesystem-safe string
 * (e.g. `2026-07-25_14-30-05`) instead of the default `2026-07-25 14:30:05`.
 * @param options.onlyNumbers - If `true`, strips all `-`/`:` separators from `datetime`, e.g.
 * `20260725143005`. Takes precedence over `fileFormat`.
 * @returns `date` (`YYYY-MM-DD`), `time` (`HH:mm:ss`), and `datetime` (combined, formatted per
 * the options above).
 */
export function getDateTime(options?: {
  fileFormat?: boolean;
  onlyNumbers?: boolean;
}): { date: string; time: string; datetime: string } {
  const now = new Date();
  let day: string | number = now.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month: string | number = now.getUTCMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const date = `${now.getUTCFullYear()}-${month}-${day}`;

  let hours: string | number = now.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes: string | number = now.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let seconds: string | number = now.getUTCSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  const time = `${hours}:${minutes}:${seconds}`;

  const datetime = options?.onlyNumbers
    ? `${date.replaceAll("-", EMPTY)}${time.replaceAll(":", EMPTY)}`
    : `${date}${options?.fileFormat ? `_${time.replaceAll(":", "-")}` : ` ${time}`}`;

  return { date, time, datetime };
}
