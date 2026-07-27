import { Environment } from "@configs/environment.config";
import { EMPTY } from "@data/constants/string.constants";
import { getDateTime } from "@utils/datetime.utils";
import * as fs from "fs";
import { TransformableInfo } from "logform";
import * as os from "os";
import * as path from "path";
import winston from "winston";

/**
 * Shape of a Winston log entry by the time it reaches the terminal formatters, once `timestamp`
 * (timestamp format), `defaultMeta` (worker/shard/environment/application/pid/hostname — see
 * {@link startLogger}), and `errors({ stack: true })` (`stack`, only when an `Error` was logged)
 * have all been applied.
 */
interface LogInfo extends TransformableInfo {
  timestamp: string;
  message: string;
  worker: string;
  shard?: string;
  environment: string;
  application: string;
  pid: number;
  hostname: string;
  stack?: string;
}

/**
 * Width the `[level]` label is padded to so the trailing `:` lines up across levels. `9` =
 * `"verbose".length` (the longest built-in npm level) + 2 for the brackets.
 */
const LEVEL_LABEL_WIDTH = 9;

/**
 * ANSI color codes for each level, matching winston's own default npm-level color scheme
 * (`error` red, `warn` yellow, `info`/`http` green, `verbose` cyan, `debug` blue, `silly`
 * magenta). Applied manually in {@link TEXT_PRINTF_FORMATTER} instead of via
 * `winston.format.colorize()`: that format wraps `level` in these same escape codes *before*
 * padding runs, and since `padEnd` counts the invisible escape characters toward the string's
 * length, the (already long enough looking) colorized string never actually gets padded. Coloring
 * the label ourselves, after padding it as plain text, avoids that entirely.
 */
const LEVEL_COLOR_CODES: Record<string, string> = {
  error: "31",
  warn: "33",
  info: "32",
  http: "32",
  verbose: "36",
  debug: "34",
  silly: "35",
};

/** Wraps `text` in the ANSI color code for `level` (see {@link LEVEL_COLOR_CODES}), or returns it unchanged if `level` isn't one of the known npm levels. */
function colorizeLevel(text: string, level: string): string {
  const code = LEVEL_COLOR_CODES[level];
  return code ? `\u001b[${code}m${text}\u001b[39m` : text;
}

/**
 * Human-readable text line: `timestamp - [level]   (w<worker>[/s<shard>]): message`, with the
 * error stack (if any) appended on its own indented line. The worker/shard tag matters even for
 * single-machine local runs: with `LOG_CONSOLE` enabled, several workers' output interleaves in
 * the same terminal in real time, and this is the only way to tell which line came from which.
 */
const TEXT_PRINTF_FORMATTER = winston.format.printf((info) => {
  const { level, message, timestamp, worker, shard, stack } = info as LogInfo;
  const paddedLevel = `[${level}]`.padEnd(LEVEL_LABEL_WIDTH, " ");
  const coloredLevel = colorizeLevel(paddedLevel, level);
  const contextTag = shard ? `(w${worker}/s${shard})` : `(w${worker})`;
  const line = `${timestamp} - ${coloredLevel} ${contextTag}: ${message}`;
  return stack ? `${line}\n${stack}` : line;
});

/** Custom timestamp format used only by the text pipeline; the JSON pipeline uses winston's default ISO 8601 timestamp instead, since that's what log-ingestion tools (Splunk, etc.) recognize natively. */
const TEXT_TIMESTAMP_FORMAT = { format: Environment.LOG_TIMESTAMP_FORMAT };

/**
 * Pre-compiled once at module load (`Environment.LOG_LINE_LENGTH` never changes at runtime) so
 * {@link TestAutomationLogger.getBoundaryMarker} isn't recompiling the same regex on every line
 * of every log file it scans.
 */
const BOUNDARY_MARKER_PATTERN = new RegExp(
  `^(?:.*?)(\\*{${Environment.LOG_LINE_LENGTH}}|#{${Environment.LOG_LINE_LENGTH}})(?:.*)?$`,
);

/** Pre-compiled once at module load for the same reason as {@link BOUNDARY_MARKER_PATTERN} — `Environment.JIRA_BOARD` is fixed for the process lifetime. */
const TAGGED_EXECUTION_PATTERN = new RegExp(
  `@${Environment.JIRA_BOARD}-[A-Za-z0-9._-]+`,
  "i",
);
const BARE_EXECUTION_PATTERN = new RegExp(
  `${Environment.JIRA_BOARD}-[A-Za-z0-9._-]+`,
  "i",
);

/** Root directory for log files, relative to the process's working directory when the logger is first instantiated (typically the project root). */
export const LOG_FOLDER = "./artifacts/logs";

/**
 * Worker-scoped Winston logger singleton, used by every step class (via `BaseSteps`) and test
 * fixture (`logging.fixtures.ts`) for consistent, structured logging.
 *
 * Each worker writes to its own `TEMP-` prefixed log file. After the run, `splitGeneratedLogs()`
 * (called from `global.teardown.ts`) splits each temp file into one output file per distinct
 * Jira-tagged test execution (e.g. `SAMPLE-7-test-automation-dev-2026-07-19_14-30-05.log`), then
 * deletes the temp files — so the final log layout is organized per-test rather than per-worker.
 *
 * Every log line also carries worker/shard/environment/application/pid/hostname context (via
 * Winston's `defaultMeta`, set once at construction — see {@link startLogger}): the text format
 * surfaces the worker/shard tag inline for readability, while the JSON format includes the full
 * set as flat top-level fields for tools like Splunk to index directly.
 */
export class TestAutomationLogger {
  private static instance: TestAutomationLogger;
  private readonly winstonLogger: winston.Logger;

  /** Private — instances must be obtained via {@link getInstance}, which enforces the singleton. */
  private constructor(worker: string) {
    this.winstonLogger = TestAutomationLogger.startLogger(worker);
  }

  // ---- Public API ----

  /**
   * Returns the process-wide singleton instance, creating it on first call.
   * @param worker - Required only on the first call, since it determines the log file
   * name/path; later calls can omit it.
   * @throws If called for the first time without `worker`.
   */
  public static getInstance(worker?: string): TestAutomationLogger {
    if (!TestAutomationLogger.instance) {
      if (!worker) {
        throw new Error(
          "Worker name is required to initialize the logger instance.",
        );
      }
      TestAutomationLogger.instance = new TestAutomationLogger(worker);
    }
    return TestAutomationLogger.instance;
  }

  /**
   * Post-processes every `TEMP-test-automation-*.log` file written during the run: splits each
   * worker's log into one file per distinct test execution (see the class doc comment), writes
   * that output into the shared base directory (not the per-shard temp directory — see
   * {@link resolveLogBaseDirectory}), then removes the temp files and, if sharded, the now-empty
   * shard subdirectory. Invoked once from `global.teardown.ts`, after every worker has finished.
   * @throws If the resolved log directory doesn't exist — no test logged anything this run.
   */
  public static async splitGeneratedLogs(): Promise<void> {
    const sourceDirectory = path.resolve(
      TestAutomationLogger.resolveLogDirectory(),
    );
    if (!fs.existsSync(sourceDirectory)) {
      throw new Error(`Log directory does not exist: ${sourceDirectory}`);
    }
    const outputDirectory = path.resolve(
      TestAutomationLogger.resolveLogBaseDirectory(),
    );

    for (const logFile of TestAutomationLogger.findLogFiles(sourceDirectory)) {
      const content = fs.readFileSync(logFile, "utf8");
      for (const block of TestAutomationLogger.splitIntoExecutionBlocks(
        content,
      )) {
        if (!TestAutomationLogger.isCompleteExecutionBlock(block)) {
          continue;
        }
        const executionTag = TestAutomationLogger.extractExecutionTag(block);
        const timestamp = TestAutomationLogger.extractTimestampFromFileName(
          path.basename(logFile),
        );
        const shardSuffix = TestAutomationLogger.getShardSuffix();
        const outputFileName = `${executionTag}-test-automation-${Environment.APPLICATION_ENVIRONMENT}${shardSuffix}-${timestamp}.log`;
        fs.writeFileSync(
          path.join(outputDirectory, outputFileName),
          block,
          "utf8",
        );
      }
    }

    await TestAutomationLogger.removeTempFiles();

    // resolvedSourceDirectory only differs from outputDirectory when sharded; clean up the
    // now-empty shard-<N> directory so it doesn't linger next to the shared split output.
    if (sourceDirectory !== outputDirectory) {
      await fs.promises.rm(sourceDirectory, { recursive: true, force: true });
    }
  }

  /**
   * Deletes every `TEMP-`-prefixed log file under this run's own log directory, recursively.
   * Scoped to this run's own directory (not the whole `LOG_FOLDER` tree) so it can never touch
   * another shard's or another run's still-in-progress logs when sharing an `artifacts/` folder
   * (e.g. Docker containers bind-mounting the same host directory).
   */
  static async removeTempFiles(): Promise<void> {
    await TestAutomationLogger.removeTempFilesFromDirectory(
      path.resolve(TestAutomationLogger.resolveLogDirectory()),
    );
  }

  /**
   * Returns whether debug-level messages will actually be logged at the current configured
   * level. Winston's npm levels get *more verbose* as their number *increases* (error=0 ...
   * debug=5 ... silly=6), so "configured level's number >= debug's number" correctly means
   * "at least as verbose as debug".
   */
  isDebugEnabled(): boolean {
    const currentLevel =
      this.winstonLogger.levels[this.winstonLogger.level] ?? -1;
    const debugLevel = this.winstonLogger.levels["debug"] ?? Infinity;
    return currentLevel >= debugLevel;
  }

  /** Accepts an `Error` as well as a plain string — when given an `Error`, its stack trace is captured and surfaced (see `TEXT_PRINTF_FORMATTER` / the `stack` field in JSON output). */
  info(message: string | Error): void {
    this.winstonLogger.info(message);
  }

  /** Only emitted if the configured log level allows it — see {@link isDebugEnabled}. Accepts an `Error` like {@link info}. */
  debug(message: string | Error): void {
    this.winstonLogger.debug(message);
  }

  /** Accepts an `Error` like {@link info}. */
  error(message: string | Error): void {
    this.winstonLogger.error(message);
  }

  /** Accepts an `Error` like {@link info}. */
  warn(message: string | Error): void {
    this.winstonLogger.warn(message);
  }

  /** Accepts an `Error` like {@link info}. */
  verbose(message: string | Error): void {
    this.winstonLogger.verbose(message);
  }

  /** Closes the underlying Winston transports (flushing any buffered writes). */
  close(): void {
    this.winstonLogger.close();
  }

  // ---- Internal helpers ----

  /**
   * The shared, date-stamped, environment-scoped directory every shard's *final* split log
   * output is written into: `<LOG_FOLDER>/<APPLICATION_ENVIRONMENT>/<today's date>`.
   *
   * A pure function of `Environment` and the current date — not of any per-process state — so it
   * resolves identically whether called from a worker process or from the separate
   * `global.teardown.ts` process, which share no memory.
   */
  private static resolveLogBaseDirectory(): string {
    const dateTime = getDateTime({ fileFormat: true });
    return `${LOG_FOLDER}/${Environment.APPLICATION_ENVIRONMENT}/${dateTime.date}`;
  }

  /**
   * This run's (this shard's, if `SHARD_INDEX` is set) *temp* log directory:
   * {@link resolveLogBaseDirectory} plus a `/shard-<N>` subdirectory when sharded. Kept separate
   * from the base directory so concurrent shards sharing a filesystem (e.g. Docker bind mounts)
   * never see or delete each other's still-in-progress temp logs.
   */
  private static resolveLogDirectory(): string {
    const shardDir = Environment.SHARD_INDEX
      ? `/shard-${Environment.SHARD_INDEX}`
      : EMPTY;
    return `${TestAutomationLogger.resolveLogBaseDirectory()}${shardDir}`;
  }

  /**
   * Builds the underlying Winston logger: a console transport (if `LOG_CONSOLE` is enabled) and
   * a file transport writing to {@link resolveLogDirectory}.
   *
   * `defaultMeta` attaches worker/shard/environment/application/pid/hostname to every log entry
   * exactly once here, rather than recomputing anything per log call — `pid`/`hostname` are
   * fixed for this process's whole lifetime, and `worker`/`shard`/`environment`/`application`
   * are fixed for this logger instance's whole lifetime.
   */
  private static startLogger(worker: string): winston.Logger {
    const dateTime = getDateTime({ fileFormat: true });
    const transports = [];

    if (Environment.LOG_CONSOLE) {
      transports.push(new winston.transports.Console());
    }
    const dirpath = TestAutomationLogger.resolveLogDirectory();
    const shardSuffix = TestAutomationLogger.getShardSuffix();
    transports.push(
      new winston.transports.File({
        filename: `TEMP-test-automation-${worker}${shardSuffix}-${dateTime.datetime}.log`,
        dirname: dirpath,
      }),
    );

    return winston.createLogger({
      level: Environment.LOG_LEVEL,
      format: TestAutomationLogger.getFormat(),
      defaultMeta: {
        worker,
        shard: Environment.SHARD_INDEX || undefined,
        environment: Environment.APPLICATION_ENVIRONMENT,
        application: Environment.APPLICATION,
        pid: process.pid,
        hostname: os.hostname(),
      },
      transports,
    });
  }

  /** Returns `-shard<N>` when running as a sharded job (`SHARD_INDEX` set), or an empty string otherwise — appended to log filenames so parallel shards don't overwrite each other's logs. */
  private static getShardSuffix(): string {
    return Environment.SHARD_INDEX ? `-shard${Environment.SHARD_INDEX}` : EMPTY;
  }

  /** Selects the JSON or text log format pipeline based on `Environment.LOG_TYPE`. */
  private static getFormat(): winston.Logform.Format {
    return Environment.LOG_TYPE === "json"
      ? TestAutomationLogger.jsonFormat()
      : TestAutomationLogger.textFormat();
  }

  /**
   * Splunk-friendly JSON format: one compact JSON object per line (no pretty-printing — tools
   * that tail/ingest logs line-by-line expect exactly one event per line), an ISO 8601 timestamp
   * (recognized natively by most log-ingestion tools' default time extraction), and every
   * `defaultMeta` field as a flat top-level key rather than nested under a `metadata` object, so
   * they're directly usable as searchable/extractable fields.
   */
  private static jsonFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
    );
  }

  /** Human-readable colored text format — coloring and padding are both handled inside {@link TEXT_PRINTF_FORMATTER} itself (see its doc comment for why `winston.format.colorize()` isn't used here). */
  private static textFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(TEXT_TIMESTAMP_FORMAT),
      TEXT_PRINTF_FORMATTER,
    );
  }

  /** Recursively finds every `TEMP-test-automation-*.log` file under `directoryPath`, sorted for deterministic processing order. */
  private static findLogFiles(directoryPath: string): string[] {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    const logFiles: string[] = [];
    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        logFiles.push(...TestAutomationLogger.findLogFiles(entryPath));
        continue;
      }
      if (entry.isFile() && TestAutomationLogger.isSourceLogFile(entry.name)) {
        logFiles.push(entryPath);
      }
    }
    return logFiles.sort((left, right) => left.localeCompare(right));
  }

  /** Matches raw per-worker log filenames produced by {@link startLogger} (the `TEMP-` prefix distinguishes them from already-split output files). */
  private static isSourceLogFile(fileName: string): boolean {
    return /^TEMP-test-automation-.*\.log$/i.test(fileName);
  }

  /**
   * Splits a raw log file's content into per-test blocks, delimited by lines of repeated `*`
   * (start) / `#` (end) — see `logging.fixtures.ts`'s `autologger`, which wraps every test with
   * those markers. Lines outside a block are discarded. Empty/marker-only blocks are filtered
   * via {@link isMeaningfulExecutionBlock}.
   *
   * Marker detection ({@link getBoundaryMarker}) matches the run of `*`/`#` characters as a
   * substring anywhere in the line, so this works unchanged regardless of whether the active
   * format prefixes each line with a timestamp/level/context tag (text) or wraps it in a JSON
   * object (json) — the marker run of characters is still present as a substring either way.
   */
  private static splitIntoExecutionBlocks(content: string): string[] {
    const lines = content.split(/\r?\n/);
    const blocks: string[] = [];
    const currentBlock: string[] = [];
    let insideExecution = false;

    const flush = () => {
      currentBlock.push("#".repeat(Environment.LOG_LINE_LENGTH));
      const blockContent = currentBlock.join("\n").trim();
      if (TestAutomationLogger.isMeaningfulExecutionBlock(blockContent)) {
        blocks.push(blockContent);
      }
      currentBlock.length = 0;
    };

    for (const line of lines) {
      const marker = TestAutomationLogger.getBoundaryMarker(line);
      if (marker === "*") {
        if (insideExecution) {
          flush();
        }
        currentBlock.push("*".repeat(Environment.LOG_LINE_LENGTH));
        insideExecution = true;
        continue;
      }
      if (marker === "#") {
        if (insideExecution) {
          flush();
          insideExecution = false;
        }
        continue;
      }
      if (insideExecution) {
        currentBlock.push(line);
      }
    }
    return blocks;
  }

  /** Detects whether a log line is a `*` (start) or `#` (end) boundary marker, stripping ANSI color codes first since colorized output can wrap the marker characters in escape sequences. */
  private static getBoundaryMarker(line: string): "*" | "#" | undefined {
    const normalizedLine = line.replace(/\u001b\[[0-9;]*m/g, EMPTY).trim();
    const markerMatch = normalizedLine.match(BOUNDARY_MARKER_PATTERN);
    if (!markerMatch?.[1]) {
      return undefined;
    }
    return markerMatch[1].startsWith("*") ? "*" : "#";
  }

  /**
   * Extracts the Jira tag (e.g. `SAMPLE-7`) associated with a test execution block, used to name
   * its split-out log file. Prefers an `@`-prefixed match (how tests are actually tagged) and
   * falls back to a bare match; returns an empty string for an untagged test.
   */
  private static extractExecutionTag(content: string): string {
    const match =
      content.match(TAGGED_EXECUTION_PATTERN) ??
      content.match(BARE_EXECUTION_PATTERN);
    return match ? match[0].replace(/^@/, EMPTY) : EMPTY;
  }

  /** Returns whether a block has any content beyond its `*`/`#` marker lines — guards against writing out an effectively-empty split file. */
  private static isMeaningfulExecutionBlock(content: string): boolean {
    const markerLine = "*".repeat(100);
    const endMarkerLine = "#".repeat(100);
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .some(
        (line) =>
          line.length > 0 && line !== markerLine && line !== endMarkerLine,
      );
  }

  /** Returns whether a block has both a start and end marker plus non-trivial content — used to skip blocks truncated by the process exiting mid-test (see {@link splitGeneratedLogs}). */
  private static isCompleteExecutionBlock(content: string): boolean {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return false;
    }
    const lines = trimmedContent.split(/\r?\n/).map((line) => line.trim());
    const hasStartMarker = lines.some(
      (line) => TestAutomationLogger.getBoundaryMarker(line) === "*",
    );
    const hasEndMarker = lines.some(
      (line) => TestAutomationLogger.getBoundaryMarker(line) === "#",
    );
    return (
      hasStartMarker &&
      hasEndMarker &&
      TestAutomationLogger.isMeaningfulExecutionBlock(trimmedContent)
    );
  }

  /** Extracts the `YYYY-MM-DD_HH-MM-SS` timestamp embedded in a worker log's filename (see {@link startLogger}), reused for the split output file's own timestamp. */
  private static extractTimestampFromFileName(fileName: string): string {
    const match = fileName.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})/);
    return match && match[1] ? match[1] : EMPTY;
  }

  /**
   * Recursive helper for {@link removeTempFiles}. Uses {@link isSourceLogFile}'s strict
   * `TEMP-test-automation-*.log` pattern rather than a loose `starts with "temp"` check, so it
   * can never delete an unrelated file that merely happens to start with "temp".
   */
  private static async removeTempFilesFromDirectory(
    directoryPath: string,
  ): Promise<void> {
    if (!fs.existsSync(directoryPath)) {
      return;
    }
    const entries = await fs.promises.readdir(directoryPath, {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        await TestAutomationLogger.removeTempFilesFromDirectory(entryPath);
        continue;
      }
      if (entry.isFile() && TestAutomationLogger.isSourceLogFile(entry.name)) {
        await fs.promises.unlink(entryPath);
      }
    }
  }
}
