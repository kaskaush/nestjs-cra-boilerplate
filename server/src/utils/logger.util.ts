import { LoggerService, LogLevel, Optional } from '@nestjs/common';

import { clc, yellow } from '@nestjs/common/utils/cli-colors.util';
import { isObject } from '@nestjs/common/utils/shared.utils';

const colorize: boolean = process.env.ENV === 'local';
const colorless = (t) => `${t}`;
const _yellow = colorize ? yellow : colorless;

export default class Logger implements LoggerService {
  private static logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug'];
  private static instance?: typeof Logger | LoggerService = Logger;

  constructor(@Optional() protected context?: string) {}

  error(message: string, trace = '', context?: string): void {
    const instance = this.getInstance();
    if (!this.isLogLevelEnabled('error')) {
      return;
    }
    instance &&
      instance.error.call(instance, message, trace, context || this.context);
  }

  log(message: string, context?: string): void {
    this.callFunction('log', message, context);
  }

  info(message: string, context?: string): void {
    this.callFunction('log', message, context);
  }

  warn(message: string, context?: string): void {
    this.callFunction('warn', message, context);
  }

  debug(message: string, context?: string): void {
    this.callFunction('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.callFunction('verbose', message, context);
  }

  setContext(context: string): void {
    this.context = context;
  }

  static overrideLogger(logger: LoggerService | LogLevel[] | boolean): void {
    if (Array.isArray(logger)) {
      this.logLevels = logger;
      return;
    }
    this.instance = isObject(logger) ? (logger as LoggerService) : undefined;
  }

  static log(message: string, context = ''): void {
    this.printMessage(message, clc.green, context, 'INFO');
  }

  static error(message: string, trace = '', context = ''): void {
    this.printMessage(message, clc.red, context, 'ERROR');
    this.printStackTrace(trace);
  }

  static warn(message: string, context = ''): void {
    this.printMessage(message, clc.yellow, context, 'WARN');
  }

  static debug(message: string, context = ''): void {
    this.printMessage(message, clc.magentaBright, context, 'DEBUG');
  }

  static verbose(message: string, context = ''): void {
    this.printMessage(message, clc.cyanBright, context, 'VERBOSE');
  }

  private callFunction(
    name: 'log' | 'warn' | 'debug' | 'verbose',
    message: string,
    context?: string,
  ): void {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }

    const instance = this.getInstance();
    const func = instance && (instance as typeof Logger)[name];
    func && func.call(instance, message, context || this.context, name);
  }

  private getInstance(): typeof Logger | LoggerService {
    const { instance } = Logger;
    return instance === this ? Logger : instance;
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return Logger.logLevels.includes(level);
  }

  private static printMessage(
    message: string | object,
    color: (message: string) => string,
    context = '',
    name = '',
  ): void {
    const _color = colorize ? color : colorless;
    const output = isObject(message)
      ? `${_color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
      : _color(message);

    // Timestamp to include the milliseconds
    const timestamp = new Date(Date.now()).toISOString();

    const contextMessage = context ? _yellow(`[${context}] `) : '';

    process.stdout.write(`${timestamp} ${name} - ${contextMessage}${output}\n`);
  }

  private static printStackTrace(trace: string): void {
    if (!trace) {
      return;
    }
    process.stdout.write(`${trace}\n`);
  }
}
