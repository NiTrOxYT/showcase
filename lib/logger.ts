type LogLevel = "info" | "warn" | "error" | "debug";

const isProduction = process.env.NODE_ENV === "production";

function log(level: LogLevel, message: string, ...args: unknown[]) {
  if (isProduction && level === "debug") {
    return;
  }

  const prefix = `[AVENIQ][${level.toUpperCase()}]`;

  switch (level) {
    case "info":
      console.log(prefix, message, ...args);
      break;
    case "warn":
      console.warn(prefix, message, ...args);
      break;
    case "error":
      console.error(prefix, message, ...args);
      break;
    case "debug":
      console.debug(prefix, message, ...args);
      break;
  }
}

export const logger = {
  info: (msg: string, ...args: unknown[]) => log("info", msg, ...args),
  warn: (msg: string, ...args: unknown[]) => log("warn", msg, ...args),
  error: (msg: string, ...args: unknown[]) => log("error", msg, ...args),
  debug: (msg: string, ...args: unknown[]) => log("debug", msg, ...args),
};
