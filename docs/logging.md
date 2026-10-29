# Server logging

The server defaults to readable console output with timestamps, aligned levels,
compact context, and indented error stacks:

```text
2026-10-30T10:15:00.000Z INFO  Server is running | port=5000
2026-10-30T10:15:01.000Z INFO  HTTP request completed | method=GET  statusCode=200  durationMs=12.3ms
```

Levels are colored in interactive terminals. Redirected output has no ANSI colors;
set `NO_COLOR` to disable colors in terminals too. Set `LOG_FORMAT=json` for one
JSON record per line with `timestamp`, `level`, `message`, and `context` when using
log collectors. `LOG_FORMAT=pretty` (the default) restores readable output.
Debug/info go to stdout; warn/error go to stderr.

Set `LOG_LEVEL` in `server/.env` to `debug`, `info` (default), `warn`, `error`,
or `silent`. Unknown values fall back to `info`. Restart after changing it.

```ts
import { logger } from "@/infrastructure/logging/logger";

logger.info("Operation completed", { operation: "media-upload", count: 3 });
logger.error("Operation failed", { error });
```

Each HTTP response includes a generated `X-Request-Id`. Completion logs include
the same ID, method, matched route template, status, duration in milliseconds,
and whether the connection was aborted. HTTP error logs use the same request ID.
Request bodies, headers, raw URLs and query strings are not recorded.

Context keys containing passwords, tokens, secrets, authorization, cookies,
API keys, OTPs or MongoDB URIs are redacted recursively. Errors retain their
name, message and stack; custom properties are omitted. Redaction is key-based:
do not put credentials or personal data into messages, error text or arbitrary
string values. Circular references and bigint metadata are supported.

Run `npm test` and `npm run build` from `server/` to verify logging.
