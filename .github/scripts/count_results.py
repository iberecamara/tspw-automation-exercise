"""
Count Allure result statuses for a single browser's merged raw results,
and write total/passed/failed/skipped as GitHub Actions step outputs.

Reads: artifacts/reports/allure/allure-results/*-result.json
Writes: GITHUB_OUTPUT lines total=, passed=, failed=, skipped=

"failed" folds in Allure's "broken" status; "skipped" folds in "unknown",
to match the four-column Total/Failed/Passed/Skipped layout used in the
hub page.
"""

import glob
import json
import os

RESULTS_GLOB = "artifacts/reports/allure/allure-results/*-result.json"


def main():
    files = glob.glob(RESULTS_GLOB)
    counts = {"passed": 0, "failed": 0, "broken": 0, "skipped": 0, "unknown": 0}

    for path in files:
        try:
            with open(path) as f:
                data = json.load(f)
            status = data.get("status", "unknown")
            if status not in counts:
                status = "unknown"
            counts[status] += 1
        except Exception:
            pass

    total = sum(counts.values())
    passed = counts["passed"]
    failed = counts["failed"] + counts["broken"]
    skipped = counts["skipped"] + counts["unknown"]

    with open(os.environ["GITHUB_OUTPUT"], "a") as out:
        out.write(f"total={total}\n")
        out.write(f"passed={passed}\n")
        out.write(f"failed={failed}\n")
        out.write(f"skipped={skipped}\n")


if __name__ == "__main__":
    main()
