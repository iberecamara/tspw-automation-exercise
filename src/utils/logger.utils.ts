import { Environment } from "@configs/environment.config";
import { EMPTY } from "@data/constants/string.constants";
import { DateTimeUtils } from "@utils/datetime.utils";
import * as fs from "fs";
import { TransformableInfo } from "logform";
import * as path from "path";
import winston from "winston";

/** Shape of a Winston log entry once `timestamp` has been attached by the timestamp format. */
interface LogInfo extends TransformableInfo {
  timestamp: string;
  message: string;
}

/** Renders every log line as `[level] - timestamp: message`, used by both the text and JSON format pipelines. */
const PRINTF_FORMATTER = winston.format.printf((info) => {
  const { level, message, timestamp } = info as LogInfo;
  return `${timestamp} - [${level.padEnd(7, ' ')}]: ${message}`;
});

const TIMESTAMP_FORMAT = { format: Environment.LOG_TIMESTAMP_FORMAT };

/** Root directory for log files, relative to the process's working directory when the logger is first instantiated (typically the project root). */
export const LOG_FOLDER = "./artifacts/logs";

/**
 * Worker-scoped Winston logger singleton, used by every step class (via `BaseSteps`) and test
 * fixture (`logging.fixtures.ts`) for consistent, structured logging.
 *
 * One log file per worker (identified by `worker`, typically the Playwright `workerIndex`) is
 * written under a date-stamped directory during the run, using a `TEMP-` prefix. After the run
 * completes, `splitGeneratedLogs()` (invoked from `global.teardown.ts`) reprocesses each
 * `TEMP-` file into one output file per distinct Jira-tagged test execution found within it
 * (e.g. `SAMPLE-7-test-automation-dev-2026-07-19_14-30-05.log`), then deletes the temp files —
 * so the final log layout ends up organized per-test rather than per-worker.
 */
export class TestAutomationLogger {
  private static instance: TestAutomationLogger;
  private readonly winstonLogger: winston.Logger;
  lineLenght: number;
  /**
   * The directory this process's own logger instance is writing to. Set by {@link startLogger}
   * when a logger is created within a worker process.
   *
   * NOT safe to read from `splitGeneratedLogs`/`removeTempFiles`: those are invoked from
   * `global.teardown.ts`, which Playwright runs in its own separate process that never calls
   * {@link getInstance}/{@link startLogger} — so in that process this field is always still its
   * default `EMPTY` value. Use {@link resolveLogDirectory} instead wherever the directory is
   * needed independently of whether a logger has been instantiated in the current process.
   */
  static dirpath: string = EMPTY;

  /** Private — instances must be obtained via {@link getInstance}, which enforces the singleton. */
  private constructor(worker: string) {
    this.lineLenght = Environment.LOG_LINE_LENGTH;
    this.winstonLogger = TestAutomationLogger.startLogger(worker);
  }

  /**
   * Returns the process-wide singleton instance, creating it on first call.
   * @param worker - Required only on the very first call (since it determines the log file
   * name/path); subsequent calls can omit it and will simply receive the already-created
   * instance, regardless of what `worker` value they pass (or omit).
   * @throws If called for the first time without `worker`.
   */
  public static getInstance(worker?: string): TestAutomationLogger {
    if (!TestAutomationLogger.instance) {
      if (!worker) {
        throw new Error(
          "Worker name is required to initialize the logger instance.",
        );
      } else {
        TestAutomationLogger.instance = new TestAutomationLogger(worker);
      }
    }
    return TestAutomationLogger.instance;
  }

  /**
   * Computes the shared, date-stamped, environment-scoped directory every shard's *final* split
   * log output is written into: `<LOG_FOLDER>/<APPLICATION_ENVIRONMENT>/<today's date>`. Every
   * shard writes its split output here (not into its own {@link resolveLogDirectory}), so all
   * shards' per-test log files end up side by side in one place once splitting is done.
   *
   * Deliberately a pure function of `Environment` and the current date, not of any per-process
   * state — see {@link dirpath}'s doc comment for why: this same formula needs to produce an
   * identical result whether it's called from a worker process (via {@link startLogger}) or from
   * the separate `global.teardown.ts` process (via {@link splitGeneratedLogs}), and those two
   * processes share no memory.
   */
  private static resolveLogBaseDirectory(): string {
    const dateTime = DateTimeUtils.getDateTime({ fileFormat: true });
    return `${LOG_FOLDER}/${Environment.APPLICATION_ENVIRONMENT}/${dateTime.date}`;
  }

  /**
   * Computes the directory this run's (this shard's, if `SHARD_INDEX` is set) *temp* log file
   * lives under and is scanned/cleaned from: {@link resolveLogBaseDirectory}, plus an additional
   * `/shard-<N>` subdirectory when `SHARD_INDEX` is set.
   *
   * This is intentionally a different (nested) directory from {@link resolveLogBaseDirectory}:
   * see {@link startLogger}'s doc comment for why temp files need per-shard isolation, even
   * though the final split output ends up in the shared parent directory instead.
   */
  private static resolveLogDirectory(): string {
    const shardDir = Environment.SHARD_INDEX
      ? `/shard-${Environment.SHARD_INDEX}`
      : EMPTY;
    return `${TestAutomationLogger.resolveLogBaseDirectory()}${shardDir}`;
  }

  /**
   * Builds the underlying Winston logger: a console transport (if `LOG_CONSOLE` is enabled) and
   * a file transport writing to a date-stamped, environment-scoped directory under `LOG_FOLDER`
   * — with an additional `/shard-<N>` subdirectory when `SHARD_INDEX` is set (see
   * {@link resolveLogDirectory}).
   *
   * The shard subdirectory matters beyond just avoiding filename collisions: when multiple
   * shards run as separate CI runners (each with its own isolated filesystem), a shared
   * directory was harmless. But when shards run as separate Docker containers sharing the same
   * bind-mounted `artifacts/` folder, a shared directory meant {@link splitGeneratedLogs} would
   * see and process every *other* shard's temp log files too — including ones still being
   * actively written by shards that hadn't finished yet — and then delete them out from under
   * those still-running shards. Giving every shard its own subdirectory keeps each shard's temp
   * logs, and the split/cleanup that operates on them, fully isolated regardless of whether the
   * filesystem underneath is shared.
   */
  private static startLogger(worker: string): winston.Logger {
    const dateTime = DateTimeUtils.getDateTime({ fileFormat: true });
    const transports = [];

    if (Environment.LOG_CONSOLE) {
      transports.push(new winston.transports.Console());
    }
    TestAutomationLogger.dirpath = TestAutomationLogger.resolveLogDirectory();
    const shardSuffix = TestAutomationLogger.getShardSuffix();
    transports.push(
      new winston.transports.File({
        filename: `TEMP-test-automation-${worker}${shardSuffix}-${dateTime.datetime}.log`,
        dirname: TestAutomationLogger.dirpath,
      }),
    );

    return winston.createLogger({
      level: Environment.LOG_LEVEL,
      format: TestAutomationLogger.getFormat(),
      transports: transports,
    });
  }

  /** Returns `-shard<N>` when running as a sharded CI job (`SHARD_INDEX` set), or an empty string otherwise — appended to log filenames so parallel shards don't overwrite each other's logs. */
  private static getShardSuffix(): string {
    return Environment.SHARD_INDEX ? `-shard${Environment.SHARD_INDEX}` : EMPTY;
  }

  /** Selects the JSON or text log format pipeline based on `Environment.LOG_TYPE`. */
  private static getFormat(): winston.Logform.Format {
    if (Environment.LOG_TYPE === "json") {
      return TestAutomationLogger.jsonFormat();
    } else {
      return TestAutomationLogger.textFormat();
    }
  }

  /** Structured JSON log format: error stacks, JSON serialization, pretty-printing, timestamp, and metadata. */
  private static jsonFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.prettyPrint({ depth: 4, colorize: true }),
      winston.format.timestamp(TIMESTAMP_FORMAT),
      winston.format.metadata(),
      PRINTF_FORMATTER,
    );
  }

  /** Human-readable colored text log format, used for console/local development readability. */
  private static textFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.errors({ stack: true }),
      winston.format.align(),
      winston.format.timestamp(TIMESTAMP_FORMAT),
      PRINTF_FORMATTER,
      winston.format.metadata(),
    );
  }

  /**
   * Returns whether debug-level messages will actually be logged at the current configured level.
   *
   * NOTE: Winston's built-in ("npm") levels are ordered by *decreasing* severity as the number
   * *increases* (error=0 ... debug=5 ... silly=6) — counter-intuitively, a *higher* numeric level
   * value means *more verbose* logging is enabled, not more severe. So `configuredLevelNumber >=
   * debugLevelNumber` correctly means "the configured level is at least as verbose as debug"
   * (i.e. debug or silly).
   */
  isDebugEnabled(): boolean {
    return (
      this.winstonLogger.levels[this.winstonLogger.level] >=
      this.winstonLogger.levels["debug"]
    );
  }

  /** Logs at info level. */
  info(message: string): void {
    this.winstonLogger.info(message);
  }

  /** Logs at debug level (only emitted if the configured log level allows it, see {@link isDebugEnabled}). */
  debug(message: string): void {
    this.winstonLogger.debug(message);
  }

  /** Logs at error level. */
  error(message: string): void {
    this.winstonLogger.error(message);
  }

  /** Logs at warn level. */
  warn(message: string): void {
    this.winstonLogger.warn(message);
  }

  /** Logs at verbose level. */
  verbose(message: string): void {
    this.winstonLogger.verbose(message);
  }

  /** Closes the underlying Winston transports (flushing any buffered writes). */
  close(): void {
    this.winstonLogger.close();
  }

  /**
   * Post-processes every `TEMP-test-automation-*.log` file written during the run: splits each
   * worker's single log file into one output file per distinct test execution (see the class doc
   * comment), then removes the original temp files. Invoked once from `global.teardown.ts`, after
   * every worker has finished logging.
   *
   * Resolves its target directory via {@link resolveLogDirectory} rather than reading
   * {@link dirpath} — this method runs in Playwright's separate `global.teardown.ts` process,
   * which never calls {@link getInstance}/{@link startLogger}, so `dirpath` would still be its
   * default empty value there.
   * @throws If the resolved log directory doesn't exist — this would indicate no test ever
   * actually ran/logged anything (for this environment/shard/date combination).
   */
  public static async splitGeneratedLogs(): Promise<void> {
    const resolvedSourceDirectory = path.resolve(
      TestAutomationLogger.resolveLogDirectory(),
    );
    if (!fs.existsSync(resolvedSourceDirectory)) {
      throw new Error(
        `Log directory does not exist: ${resolvedSourceDirectory}`,
      );
    }
    // Split output always goes into the shared base directory (the parent of the per-shard
    // temp-file directory when sharded, or the same directory when not) — never into
    // resolvedSourceDirectory itself, so every shard's final per-test log files end up side by
    // side in one place, not scattered across separate shard-<N> subdirectories.
    const resolvedOutputDirectory = path.resolve(
      TestAutomationLogger.resolveLogBaseDirectory(),
    );
    const logFiles = TestAutomationLogger.findLogFiles(resolvedSourceDirectory);
    for (const logFile of logFiles) {
      const content = fs.readFileSync(logFile, "utf8");
      // Each `*`-delimited block in the log corresponds to one test (see `logging.fixtures.ts`'s
      // `autologger`, which wraps every test with a line of `*` before/after it). Only complete
      // blocks (with both a start and an end marker) are written out — a block truncated by the
      // process exiting mid-test is silently skipped rather than producing a malformed log file.
      for (const executionContent of TestAutomationLogger.splitIntoExecutionBlocks(
        content,
      )) {
        if (!TestAutomationLogger.isCompleteExecutionBlock(executionContent)) {
          continue;
        }
        const executionTag =
          TestAutomationLogger.extractExecutionTag(executionContent);
        const timestamp = TestAutomationLogger.extractTimestampFromFileName(
          path.basename(logFile),
        );
        const shardSuffix = TestAutomationLogger.getShardSuffix();
        const outputFileName = `${executionTag}-test-automation-${Environment.APPLICATION_ENVIRONMENT}${shardSuffix}-${timestamp}.log`;
        const outputFilePath = path.join(
          resolvedOutputDirectory,
          outputFileName,
        );
        fs.writeFileSync(outputFilePath, executionContent, "utf8");
      }
    }

    await TestAutomationLogger.removeTempFiles();

    // Once every temp file has been split out and deleted, the per-shard directory (if there was
    // one — resolvedSourceDirectory only differs from resolvedOutputDirectory when sharded) is
    // empty and no longer needed; remove it so shard-<N> folders don't linger as clutter next to
    // the actual (shared) split log output.
    if (resolvedSourceDirectory !== resolvedOutputDirectory) {
      await fs.promises.rm(resolvedSourceDirectory, {
        recursive: true,
        force: true,
      });
    }
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

  /** Matches the raw per-worker log filenames produced by {@link startLogger} (the `TEMP-` prefix distinguishes them from already-split output files). */
  private static isSourceLogFile(fileName: string): boolean {
    return /^TEMP-test-automation-.*\.log$/i.test(fileName);
  }

  /**
   * Splits a raw log file's content into per-test blocks, delimited by lines of repeated `*`
   * (test start) and `#` (test end) characters — see `logging.fixtures.ts`'s `autologger` fixture,
   * which emits those markers around every test. Lines outside any `*`...`#` block (i.e. before
   * the first test starts, or between tests) are discarded. Each returned block re-adds its own
   * closing `#` line and is trimmed; empty/marker-only blocks are filtered out via
   * {@link isMeaningfulExecutionBlock}.
   */
  private static splitIntoExecutionBlocks(content: string): string[] {
    const lines = content.split(/\r?\n/);
    const blocks: string[] = [];
    const currentBlock: string[] = [];
    let insideExecution = false;
    for (const line of lines) {
      const marker = TestAutomationLogger.getBoundaryMarker(line);
      if (marker === "*") {
        if (insideExecution) {
          currentBlock.push("#".repeat(Environment.LOG_LINE_LENGTH));
          const blockContent = currentBlock.join("\n").trim();
          if (TestAutomationLogger.isMeaningfulExecutionBlock(blockContent)) {
            blocks.push(blockContent);
          }
          currentBlock.length = 0;
        }
        currentBlock.push("*".repeat(Environment.LOG_LINE_LENGTH));
        insideExecution = true;
        continue;
      }
      if (marker === "#") {
        if (insideExecution) {
          currentBlock.push("#".repeat(Environment.LOG_LINE_LENGTH));
          const blockContent = currentBlock.join("\n").trim();
          if (TestAutomationLogger.isMeaningfulExecutionBlock(blockContent)) {
            blocks.push(blockContent);
          }
          currentBlock.length = 0;
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

  /** Detects whether a log line is a `*` (start) or `#` (end) boundary marker, stripping ANSI color codes first since colorized console-style output can wrap the marker characters in escape sequences. */
  private static getBoundaryMarker(line: string): "*" | "#" | undefined {
    const normalizedLine = line.replace(/\u001b\[[0-9;]*m/g, EMPTY).trim();
    const markerMatch = normalizedLine.match(
      new RegExp(
        `^(?:.*?)(\\*{${Environment.LOG_LINE_LENGTH}}|#{${Environment.LOG_LINE_LENGTH}})(?:.*)?$`,
      ),
    );
    return markerMatch
      ? markerMatch[1].startsWith("*")
        ? "*"
        : "#"
      : undefined;
  }

  /**
   * Extracts the Jira tag (e.g. `SAMPLE-7`) associated with a test execution block, used to name
   * its split-out log file. Looks first for an `@`-prefixed tag (as tests are actually tagged,
   * e.g. `@SAMPLE-7`) and falls back to a bare, un-prefixed match; returns an empty string if
   * neither is found (e.g. an untagged test), in which case the split file's name simply omits
   * the tag portion.
   */
  private static extractExecutionTag(content: string): string {
    const match =
      content.match(
        new RegExp(`@${Environment.JIRA_BOARD}-[A-Za-z0-9._-]+`, "i"),
      ) ??
      content.match(
        new RegExp(`${Environment.JIRA_BOARD}-[A-Za-z0-9._-]+`, "i"),
      );
    return match ? match[0].replace(/^@/, EMPTY) : EMPTY;
  }

  /** Returns whether a block has any actual log content beyond the `*`/`#` marker lines themselves — guards against writing out an effectively-empty split file. */
  private static isMeaningfulExecutionBlock(content: string): boolean {
    const nonMarkerLines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => line !== "*".repeat(100))
      .filter((line) => line !== "#".repeat(100));
    return nonMarkerLines.length > 0;
  }

  /** Returns whether a block has both a start (`*`) and an end (`#`) marker and non-trivial content — used to skip truncated/incomplete blocks (see {@link splitGeneratedLogs}). */
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
    return match ? match[1] : EMPTY;
  }

  /**
   * Deletes every `TEMP-`-prefixed log file under this run's own log directory (see
   * {@link resolveLogDirectory}), recursively — the final cleanup step of
   * {@link splitGeneratedLogs}, once every temp file's content has been re-written into its
   * split, per-test output file(s).
   *
   * Deliberately scoped to this run's own directory rather than the whole `LOG_FOLDER` tree:
   * scanning/deleting the entire tree would also catch temp files belonging to other shards or
   * other concurrently-running dates/environments sharing the same `artifacts/` folder (e.g.
   * multiple Docker containers bind-mounting the same host directory), which could delete a
   * still-in-progress run's logs out from under it. Resolves the directory itself (rather than
   * reading {@link dirpath}) for the same cross-process reason documented on
   * {@link splitGeneratedLogs}.
   */
  static async removeTempFiles(): Promise<void> {
    await TestAutomationLogger.removeTempFilesFromDirectory(
      path.resolve(TestAutomationLogger.resolveLogDirectory()),
    );
  }

  /**
   * Recursive helper for {@link removeTempFiles}. Reuses {@link isSourceLogFile}'s strict
   * `TEMP-test-automation-*.log` pattern (rather than a loose `/^TEMP/i` check) so this can never
   * delete an unrelated file that merely starts with "temp" case-insensitively — e.g. a real
   * incident this framework hit: `@babel/runtime`'s `temporalRef.js`, matched and (failed to)
   * delete when this method was walking the wrong directory due to an earlier version of the
   * {@link resolveLogDirectory} bug. The precise pattern is a second line of defense in case
   * directory scoping is ever wrong again for some other reason.
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