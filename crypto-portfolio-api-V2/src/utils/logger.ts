// Structured JSON logger.
// Every log line is a single JSON object — easy to grep, pipe, or ship to any
// observability tool later (Datadog, ELK, CloudWatch) without changing code.

type LogLevel = 'info' | 'warn' | 'error';

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  return JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  });
}

export const logger = {

  info(message: string, meta?: Record<string, unknown>): void {
    console.log(formatEntry('info', message, meta));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(formatEntry('warn', message, meta));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(formatEntry('error', message, meta));
  },
};
