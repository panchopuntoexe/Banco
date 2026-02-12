import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  source?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly isProduction = false;
  private logHistory: LogEntry[] = [];
  private readonly maxHistorySize = 100;

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      source
    };

    this.addToHistory(entry);

    if (this.isProduction && level === LogLevel.DEBUG) {
      return;
    }

    this.logToConsole(entry);

    if (this.isProduction && level === LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? `[${entry.source}]` : '';
    const formattedMessage = `${timestamp} ${source} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.data);
        break;
    }
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    console.warn('Log enviado a servicio externo:', entry);
  }
}
