import "dotenv/config";

const levels = { debug: 10, info: 20, warn: 30, error: 40, silent: Infinity };
export type LogLevel = Exclude<keyof typeof levels, "silent">;
type Context = Record<string, unknown>;
const sensitiveKey =
  /password|passwd|secret|token|authorization|cookie|api[_-]?key|otp|mongo[_-]?uri/i;

const colors: Record<LogLevel, number> = {
  debug: 90,
  info: 36,
  warn: 33,
  error: 31,
};
const singleLine = (value: string) => value.replace(/[\r\n\x1b]/g, " ");

function pretty(
  timestamp: string,
  level: LogLevel,
  message: string,
  context: Context,
  color: boolean,
) {
  const label = level.toUpperCase().padEnd(5);
  const badge = color ? `\x1b[${colors[level]}m${label}\x1b[0m` : label;
  const details: string[] = [];
  const stacks: string[] = [];
  for (const [key, value] of Object.entries(context)) {
    if (value === undefined) continue;
    if (
      value &&
      typeof value === "object" &&
      "stack" in value &&
      typeof value.stack === "string"
    ) {
      stacks.push(
        value.stack
          .split(/\r?\n/)
          .map((line) => `    ${singleLine(line)}`)
          .join("\n"),
      );
      continue;
    }
    const formatted =
      key === "durationMs" && typeof value === "number"
        ? `${value.toFixed(1)}ms`
        : typeof value === "string"
          ? value
          : JSON.stringify(value);
    details.push(
      `${singleLine(key)}=${singleLine(formatted ?? String(value))}`,
    );
  }
  return `${timestamp} ${badge} ${singleLine(message)}${details.length ? ` | ${details.join("  ")}` : ""}${stacks.length ? `\n${stacks.join("\n")}` : ""}`;
}

function sanitize(value: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof value === "bigint") return value.toString();
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  try {
    // Do not serialize custom Error properties (HTTP clients often attach credentials).
    if (value instanceof Error) {
      return { name: value.name, message: value.message, stack: value.stack };
    }
    if (Array.isArray(value)) return value.map((item) => sanitize(item, seen));
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? "[REDACTED]" : sanitize(item, seen),
      ]),
    );
  } finally {
    seen.delete(value);
  }
}

export function createLogger(
  options: {
    level?: string;
    format?: "pretty" | "json";
    color?: boolean;
    write?: (line: string, level: LogLevel) => void;
  } = {},
) {
  const configured = options.level ?? process.env.LOG_LEVEL ?? "info";
  const format =
    options.format ?? (process.env.LOG_FORMAT === "json" ? "json" : "pretty");
  const threshold = Object.prototype.hasOwnProperty.call(levels, configured)
    ? levels[configured as keyof typeof levels]
    : levels.info;

  const write =
    options.write ??
    ((line: string, level: LogLevel) => {
      (level === "error" || level === "warn"
        ? process.stderr
        : process.stdout
      ).write(line + "\n");
    });

  const log = (level: LogLevel, message: string, context: Context = {}) => {
    if (levels[level] < threshold) return;
    try {
      const timestamp = new Date().toISOString();
      const safeContext = sanitize(context) as Context;
      const stream =
        level === "warn" || level === "error" ? process.stderr : process.stdout;
      const color =
        options.color ??
        (Boolean(stream.isTTY) && process.env.NO_COLOR === undefined);

      write(
        format === "pretty"
          ? pretty(timestamp, level, message, safeContext, color)
          : JSON.stringify({
              timestamp,
              level,
              message,
              context: safeContext,
            }),
        level,
      );
    } catch {
      // Logging must not turn a successful application operation into a failure.
    }
  };
  return {
    debug: (message: string, context?: Context) =>
      log("debug", message, context),
    info: (message: string, context?: Context) => log("info", message, context),
    warn: (message: string, context?: Context) => log("warn", message, context),
    error: (message: string, context?: Context) =>
      log("error", message, context),
  };
}

export const logger = createLogger();
