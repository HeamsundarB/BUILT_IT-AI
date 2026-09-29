// =============================================================================
// BUILTIT AI - Centralized Logger
// =============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  requestId?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getMinLevel(): LogLevel {
  const env = process.env.LOG_LEVEL as LogLevel | undefined;
  if (env && LOG_LEVELS[env] !== undefined) return env;
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

function formatEntry(entry: LogEntry): string {
  const { timestamp, level, message, context, data } = entry;
  const prefix = `[${timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''}`;
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `${prefix} ${message}${dataStr}`;
}

class Logger {
  private minLevel: LogLevel;
  private isJson: boolean;

  constructor() {
    this.minLevel = getMinLevel();
    this.isJson = process.env.LOG_FORMAT === 'json';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private write(level: LogLevel, message: string, data?: Record<string, unknown>, context?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    const output = this.isJson ? JSON.stringify(entry) : formatEntry(entry);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }

  debug(message: string, data?: Record<string, unknown>, context?: string): void {
    this.write('debug', message, data, context);
  }

  info(message: string, data?: Record<string, unknown>, context?: string): void {
    this.write('info', message, data, context);
  }

  warn(message: string, data?: Record<string, unknown>, context?: string): void {
    this.write('warn', message, data, context);
  }

  error(message: string, data?: Record<string, unknown>, context?: string): void {
    this.write('error', message, data, context);
  }

  /** Returns a child logger bound to a specific context */
  child(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }

  /** Log API request */
  request(method: string, path: string, statusCode: number, durationMs: number): void {
    this.info(`${method} ${path} ${statusCode} ${durationMs}ms`, undefined, 'HTTP');
  }
}

class ContextLogger {
  constructor(private parent: Logger, private context: string) {}

  debug(message: string, data?: Record<string, unknown>): void {
    this.parent.debug(message, data, this.context);
  }
  info(message: string, data?: Record<string, unknown>): void {
    this.parent.info(message, data, this.context);
  }
  warn(message: string, data?: Record<string, unknown>): void {
    this.parent.warn(message, data, this.context);
  }
  error(message: string, data?: Record<string, unknown>): void {
    this.parent.error(message, data, this.context);
  }
}

export const logger = new Logger();

// Specialized loggers
export const authLogger = logger.child('Auth');
export const aiLogger = logger.child('AI');
export const uploadLogger = logger.child('Upload');
export const exportLogger = logger.child('Export');
export const dbLogger = logger.child('Database');
