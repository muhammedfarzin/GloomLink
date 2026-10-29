import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { logger } from "../../infrastructure/logging/logger";

export const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();
  const start = process.hrtime.bigint();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  let logged = false;
  const complete = () => {
    if (logged) return;
    logged = true;
    const aborted = !res.writableFinished;
    const level =
      res.statusCode >= 500
        ? "error"
        : aborted || res.statusCode >= 400
          ? "warn"
          : "info";
    logger[level]("HTTP request completed", {
      requestId,
      method: req.method,
      // Route templates avoid recording user data in paths or query strings.
      route: req.route?.path ?? "unmatched",
      statusCode: res.statusCode,
      durationMs: Number(process.hrtime.bigint() - start) / 1e6,
      aborted,
    });
  };
  res.once("finish", complete);
  res.once("close", complete);
  next();
};
