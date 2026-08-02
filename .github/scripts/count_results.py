"""
Count Allure result statuses for a single browser's merged raw results,
treating retried attempts of the same test as one execution.

Playwright/Allure write one *-result.json file per attempt. When a test is
retried, multiple files share the same "historyId" (or, if that's absent,
the same fullName/name). This script groups files by that identity, keeps
only the last attempt (by stop time) as the test's real outcome, and counts
every earlier attempt in the group as a retry rather than a separate result.

Reads: artifacts/reports/allure/allure-results/*-result.json
Writes: GITHUB_OUTPUT lines total=, passed=, failed=, skipped=, retries=

"failed" folds in Allure's "broken" status; "skipped" folds in "unknown",
to match the four-column Total/Failed/Passed/Skipped layout used in the
hub page. "total" and the status counts reflect one entry per unique test
(post-retry); "retries" is the number of extra attempts beyond each test's
final one.
"""

import glob
import json
import os

RESULTS_GLOB = "artifacts/reports/allure/allure-results/*-result.json"


def identity_key(data):
    history_id = data.get("historyId")
    if history_id:
        return history_id
    # Fallback when historyId is missing: best-effort identity from name +
    # parameters, so retries of the same test still group together.
    full_name = data.get("fullName") or data.get("name") or ""
    params = data.get("parameters") or []
    param_key = tuple(sorted((p.get("name"), p.get("value")) for p in params))
    return (full_name, param_key)


def sort_key(data):
    # Prefer stop time, then start time, so the chronologically last attempt
    # is treated as the test's real outcome.
    return (data.get("stop") or 0, data.get("start") or 0)


def main():
    files = glob.glob(RESULTS_GLOB)
    groups = {}

    for path in files:
        try:
            with open(path) as f:
                data = json.load(f)
        except FileNotFoundError as ex:
            print(ex)
        key = identity_key(data)
        groups.setdefault(key, []).append(data)

    counts = {"passed": 0, "failed": 0, "broken": 0, "skipped": 0, "unknown": 0}
    retries = 0

    for attempts in groups.values():
        attempts.sort(key=sort_key)
        retries += len(attempts) - 1
        final = attempts[-1]
        status = final.get("status", "unknown")
        if status not in counts:
            status = "unknown"
        counts[status] += 1

    total = sum(counts.values())
    passed = counts["passed"]
    failed = counts["failed"] + counts["broken"]
    skipped = counts["skipped"] + counts["unknown"]

    with open(os.environ["GITHUB_OUTPUT"], "a") as out:
        out.write(f"total={total}\n")
        out.write(f"passed={passed}\n")
        out.write(f"failed={failed}\n")
        out.write(f"skipped={skipped}\n")
        out.write(f"retries={retries}\n")


if __name__ == "__main__":
    main()
