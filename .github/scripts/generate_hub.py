"""
Generate pages-site/index.html (the Allure report hub) from the
.github/hub-template/index.html template.

Reads per-browser job status and test counts from environment variables
set by the calling workflow step, and fills in the template placeholders:
  __RUN_URL__       - link back to the GitHub Actions run
  __RUN_DATE__      - human-readable UTC timestamp for this run
  __REPORTS_JSON__  - JSON array of per-browser report summaries
  __TOTAL_RETRIES__ - sum of retried attempts across all browsers
"""

import json
import os
from datetime import datetime, timezone

TEMPLATE_PATH = ".github/hub-template/index.html"
OUTPUT_PATH = "pages-site/index.html"

BROWSERS = [
    ("chromium", "Chromium", "CHROMIUM"),
    ("chrome", "Chrome", "CHROME"),
    ("firefox", "Firefox", "FIREFOX"),
    ("webkit", "WebKit (Safari)", "WEBKIT"),
    ("edge", "Edge", "EDGE"),
]


def as_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def browser_entry(slug, label, prefix):
    return {
        "slug": slug,
        "label": label,
        "job_status": os.environ.get(f"{prefix}_STATUS", ""),
        "total": as_int(os.environ.get(f"{prefix}_TOTAL")),
        "passed": as_int(os.environ.get(f"{prefix}_PASSED")),
        "failed": as_int(os.environ.get(f"{prefix}_FAILED")),
        "skipped": as_int(os.environ.get(f"{prefix}_SKIPPED")),
        "retries": as_int(os.environ.get(f"{prefix}_RETRIES")),
    }


def main():
    reports = [browser_entry(slug, label, prefix) for slug, label, prefix in BROWSERS]
    total_retries = sum(r["retries"] for r in reports)
    run_date = datetime.now(timezone.utc).strftime("%-m/%-d/%Y at %H:%M UTC")

    with open(TEMPLATE_PATH) as f:
        html = f.read()

    html = html.replace("__RUN_URL__", os.environ["RUN_URL"])
    html = html.replace("__RUN_DATE__", run_date)
    html = html.replace("__REPORTS_JSON__", json.dumps(reports))
    html = html.replace("__TOTAL_RETRIES__", str(total_retries))

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        f.write(html)


if __name__ == "__main__":
    main()
