# syntax=docker/dockerfile:1

# Node 24 matches the version used by the project's own CI workflow (.github/workflows/playwright.yml).
FROM node:24-bookworm-slim

# Playwright/tests should always run headless and non-interactively inside the container.
# HEADLESS is left unset here on purpose: Environment.HEADLESS (src/configs/environment.config.ts)
# already defaults to `true` when the .env value is empty, and CI=true is picked up by some
# tools (e.g. npm) to disable interactive prompts/progress bars.
#
# PLAYWRIGHT_BROWSERS_PATH pins the browser install location to a fixed, absolute path instead
# of the default `~/.cache/ms-playwright`. This matters because the image is built as root, but
# docker-compose.yml runs the container as the host user (`user: "${HOST_UID}:${HOST_GID}"`) so
# that files written into the bind-mounted artifacts/ folder end up owned by that user, not root.
# An arbitrary UID with no /etc/passwd entry has no resolvable $HOME, which would otherwise make
# Playwright unable to find the browser it installed at build time.
ENV CI=true \
    APPLICATION_ENVIRONMENT=dev \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

# Install dependencies first so this layer is cached unless package*.json actually changes.
COPY package.json package-lock.json ./
RUN npm ci

# Now copy the rest of the project (see .dockerignore for what's excluded, e.g. node_modules,
# artifacts, .git).
COPY . .

# Only the Chromium browser is needed: it's the only project configured in
# src/configs/playwright.config.ts. --with-deps also installs the OS-level libraries Chromium
# needs to run on this base image (fonts, codecs, etc.). Installed to PLAYWRIGHT_BROWSERS_PATH
# (set above); chmod afterwards makes it readable/executable by any UID, since it's installed
# here as root but will actually be run as the host user at container start.
RUN npx playwright install --with-deps chromium && \
    chmod -R o+rX "$PLAYWRIGHT_BROWSERS_PATH"

# /app itself is owned by root (created via COPY above). The app only writes to artifacts/ at
# runtime (logs, reports, and downloaded test files — see DOWNLOADS_DIR in src/configs/paths.ts),
# which docker-compose.yml bind-mounts from the host and is writable because it's owned by the
# host user on the host side.

# Default command runs the full suite (everything except @dev-tagged tests, same as `npm test`
# locally). Override at `docker run` time to run a subset, e.g.:
#   docker run --rm tspw-automation-exercise npm run test:ui
CMD ["npm", "test"]