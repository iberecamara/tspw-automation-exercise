import { spawn } from "node:child_process";
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

interface RunOptions {
  extraEnv?: Record<string, string>;
  /** If true, buffer stdout/stderr and return it instead of streaming to the parent's stdio. */
  capture?: boolean;
}

interface CommandResult {
  code: number;
  output: string;
}

interface ShardResult {
  index: number;
  result: PromiseSettledResult<CommandResult>;
}

const SUBCOMMANDS = new Set([
  "flatten-blobs",
  "artifacts",
  "build",
  "single",
  "merge",
]);

function isShardCountArg(arg: string | undefined): boolean {
  return arg !== undefined && /^\d+$/.test(arg);
}

/**
 * Everything after the subcommand (or after the shard-count arg, or from the very start if
 * neither is present) is treated as passthrough args for Playwright itself — e.g. `--grep`,
 * `--update-snapshots`. Works whether invoked as `single --grep foo`, `4 --update-snapshots`,
 * or just `--grep foo` (default sharded run, no explicit count).
 *
 * These are handed straight through as argv elements (see runSingle/runShardedSuite) rather
 * than being joined into a shell string — Docker's entrypoint/command split appends `command`
 * overrides as already-split argv, so no shell re-parsing or quoting is involved and args with
 * spaces/quotes survive intact.
 */
export function extractPassthroughArgs(): string[] {
  const args = process.argv.slice(2);
  if (args.length === 0) return [];

  const [first, ...rest] = args;
  if (SUBCOMMANDS.has(first as string) || isShardCountArg(first)) {
    return rest;
  }
  return args;
}

export function parseShardCount(): number {
  const arg = process.argv[2];
  const raw = isShardCountArg(arg) ? arg : (process.env.SHARDS ?? "4");
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1) {
    console.error(`Invalid shard count: ${raw}`);
    process.exit(1);
  }

  return parsed;
}

// process.getuid/getgid don't exist on Windows — falls through to compose's own
// "${HOST_UID:-1000}" default there, which is fine since Docker Desktop on
// Windows/macOS doesn't have the native bind-mount UID/ownership problem that
// this override exists to solve on Linux hosts in the first place.
export function resolveHostIds(): Partial<
  Record<"HOST_UID" | "HOST_GID", string>
> {
  const HOST_UID = process.env.HOST_UID ?? process.getuid?.().toString();
  const HOST_GID = process.env.HOST_GID ?? process.getgid?.().toString();

  return {
    ...(HOST_UID ? { HOST_UID } : {}),
    ...(HOST_GID ? { HOST_GID } : {}),
  };
}

// When capture=false (default), behaves as a simple passthrough: streams straight to this
// process's own stdio, and resolves/rejects based solely on exit code — used for `build` and
// `merge-reports`, where a non-zero exit really is exceptional. When capture=true, output is
// buffered instead of streamed (so concurrent shard runs don't interleave their output) and
// is returned rather than thrown on non-zero exit, since a failing Playwright run is expected,
// reportable data — not a script error.
export function runDockerCommand(
  args: string[],
  options: RunOptions = {},
): Promise<CommandResult> {
  const { extraEnv = {}, capture = false } = options;

  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      shell: process.platform === "win32", // docker.exe resolution quirk on Windows
      env: {
        ...process.env,
        ...resolveHostIds(),
        ...extraEnv,
      },
    });

    let output = "";
    if (capture) {
      child.stdout?.on("data", (chunk: Buffer) => (output += chunk.toString()));
      child.stderr?.on("data", (chunk: Buffer) => (output += chunk.toString()));
    }

    child.on("exit", (code) => {
      const result: CommandResult = { code: code ?? 1, output };

      if (capture) {
        resolve(result);
      } else if (result.code === 0) {
        resolve(result);
      } else {
        reject(new Error(`exit ${result.code}`));
      }
    });
    child.on("error", reject);
  });
}

/**
 * Creates the `artifacts/` directory as the current (host) user if it doesn't already exist yet
 * (`npm run ensure:artifacts`), before Docker ever touches the path. Docker itself would
 * otherwise create it as root on first run — as soon as a bind mount references a path that
 * doesn't exist yet, `dockerd` (which runs as root) creates it — which defeats the `user:`
 * override in docker-compose.yml. Every function below that invokes `docker compose` calls this
 * first for exactly that reason.
 */
export function ensureArtifactsDir(): void {
  mkdirSync("artifacts", { recursive: true });
}

/** Rebuilds the Docker image with no layer cache (`npm run docker:build`). */
export async function runBuild(): Promise<void> {
  ensureArtifactsDir();
  await runDockerCommand(["compose", "build", "--no-cache"]);
}

/**
 * Runs the full suite in a single, non-sharded container, streaming output live
 * (`npm run docker:single`). Any extraArgs (e.g. --grep, --update-snapshots) are appended as
 * a `command` override, which Docker appends to the `tests` service's `entrypoint` array
 * (["npm", "test", "--"]) as already-split argv — no shell involved, no quoting needed.
 */
export async function runSingle(extraArgs: string[] = []): Promise<void> {
  ensureArtifactsDir();
  await runDockerCommand([
    "compose",
    "run",
    "--build",
    "--rm",
    "--remove-orphans",
    "tests",
    ...extraArgs,
  ]);
}

/** Runs only the report-merge step in its own container (`npm run docker:merge`). */
export async function runMerge(): Promise<void> {
  ensureArtifactsDir();
  await runDockerCommand([
    "compose",
    "run",
    "--rm",
    "--remove-orphans",
    "merge-reports",
  ]);
}

/**
 * Copies only the finished .zip files out of each shard's blob subfolder (see
 * BLOB_REPORTS_SHARD_DIR in paths.ts) into one flat directory, since `playwright merge-reports`
 * expects all .zip files directly inside a single directory, not nested under per-shard
 * subfolders. Leaves each subfolder's intermediate working files (report.jsonl, resources/)
 * where they are — they're already embedded inside the finished zip and aren't needed after
 * that, and get removed anyway by report:cleanup:shards.
 */
export function flattenBlobReports(blobDir: string): void {
  let entries;
  try {
    entries = readdirSync(blobDir, { withFileTypes: true });
  } catch {
    return; // nothing to flatten (e.g. non-sharded run never created shard subfolders)
  }

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("shard-")) {
      const shardDir = path.join(blobDir, entry.name);
      const zipFiles = readdirSync(shardDir).filter((f) => f.endsWith(".zip"));
      for (const zip of zipFiles) {
        cpSync(path.join(shardDir, zip), path.join(blobDir, zip));
      }
    }
  }
}

/**
 * extraArgs are appended as a `command` override on each `tests-shard` run. The service's
 * entrypoint (sh -c 'npm test -- --shard=$$SHARD_INDEX/$$SHARD_TOTAL "$@"' --) expands
 * SHARD_INDEX/SHARD_TOTAL from the container env (set via -e below) and re-expands "$@" from
 * its own positional params — which is exactly what the command override becomes — so args
 * with spaces/quotes pass through intact without any manual quoting here.
 */
export async function runShardedSuite(extraArgs: string[] = []): Promise<void> {
  const shards = parseShardCount();

  ensureArtifactsDir();

  await runDockerCommand(["compose", "build", "tests-shard"]);

  const indices = Array.from({ length: shards }, (_, i) => i + 1);

  const settled = await Promise.allSettled(
    indices.map((index) =>
      runDockerCommand(
        [
          "compose",
          "run",
          "--rm",
          "--remove-orphans",
          "--name",
          `tests-shard-${index}`,
          "-e",
          `SHARD_INDEX=${index}`,
          "-e",
          `SHARD_TOTAL=${shards}`,
          "tests-shard",
          ...extraArgs,
        ],
        {
          capture: true,
          extraEnv: {
            SHARD_INDEX: String(index),
            SHARD_TOTAL: String(shards),
          },
        },
      ),
    ),
  );

  const shardResults: ShardResult[] = settled.map((result, i) => ({
    index: indices[i] as number,
    result,
  }));

  // Print each shard's output as one uninterrupted, clearly-labeled block — in shard order —
  // rather than letting concurrent processes interleave lines.
  const failedIndices: number[] = [];

  for (const { index, result } of shardResults) {
    console.info(
      `\n${"=".repeat(20)} Shard ${index}/${shards} ${"=".repeat(20)}`,
    );

    if (result.status === "fulfilled") {
      console.info(result.value.output.trim());
      if (result.value.code !== 0) {
        failedIndices.push(index);
        console.info(
          `\n✗ Shard ${index} exited with code ${result.value.code}`,
        );
      } else {
        console.info(`\n✓ Shard ${index} passed`);
      }
    } else {
      // Only a genuine infra failure (docker not found, spawn error, etc.) lands here, since a
      // failing test run now resolves rather than rejects (see runDockerCommand).
      failedIndices.push(index);
      console.info(
        `✗ Shard ${index} errored before completion: ${result.reason}`,
      );
    }
  }

  console.info(`\n${"=".repeat(50)}`);
  if (failedIndices.length > 0) {
    console.info(
      `Result: ${failedIndices.length}/${shards} shard(s) failed: [${failedIndices.join(", ")}]`,
    );
  } else {
    console.info(`Result: all ${shards} shards passed`);
  }

  // Merges each shard's Allure results + Playwright blob report into single, unsharded
  // html/json/allure reports, then deletes the intermediate per-shard folders and blob zips
  // (see report:merge in package.json). Runs regardless of shard pass/fail, since a merged
  // report is most useful precisely when something failed.
  console.info(`\n${"=".repeat(50)}`);
  console.info("Merging shard reports...");

  await runDockerCommand([
    "compose",
    "run",
    "--rm",
    "--remove-orphans",
    "merge-reports",
  ]);

  console.info(
    "✓ Reports merged — no shard-specific folders remain in artifacts/reports",
  );
  console.info(`${"=".repeat(50)}\n`);

  if (failedIndices.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  const handleError = (err: unknown): void => {
    console.error(err);
    process.exit(1);
  };

  const passthroughArgs = extractPassthroughArgs();

  switch (process.argv[2]) {
    case "flatten-blobs":
      flattenBlobReports(process.argv[3] ?? "artifacts/reports/blob");
      break;
    case "artifacts":
      ensureArtifactsDir();
      break;
    case "build":
      runBuild().catch(handleError);
      break;
    case "single":
      runSingle(passthroughArgs).catch(handleError);
      break;
    case "merge":
      runMerge().catch(handleError);
      break;
    default:
      // No subcommand, or a numeric shard count (e.g. `... 8`) — run the sharded suite;
      // parseShardCount() re-reads argv[2]/SHARDS/the default itself.
      runShardedSuite(passthroughArgs).catch(handleError);
  }
}
