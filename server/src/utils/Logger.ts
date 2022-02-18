import { LoggerService, LogLevel, Optional } from '@nestjs/common';

import { clc, yellow } from '@nestjs/common/utils/cli-colors.util';
import { isObject } from '@nestjs/common/utils/shared.utils';

import * as httpContext from 'express-http-context';

const colorize: boolean = process.env.ENV === 'local';
const colorless = (t) => `${t}`;
const _yellow = colorize ? yellow : colorless;

/**
 * This is our custom logger, which we use to allow us to turn off color logs in Kubernetes,
 * and customize the output of the log messages.
 */
export default class Logger implements LoggerService {
  private static logLevels: LogLevel[] =
    process.env.LOG_LEVEL === 'debug'
      ? ['log', 'error', 'warn', 'debug']
      : ['log', 'error', 'warn'];
  private static lastTimestamp?: number;
  private static instance?: typeof Logger | LoggerService = Logger;

  constructor(
    @Optional() protected context?: string,
    @Optional() private readonly isTimestampEnabled = false,
  ) {}

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

  static log(message: string, context = '', isTimeDiffEnabled = true): void {
    this.printMessage(message, clc.green, context, isTimeDiffEnabled);
  }

  static error(
    message: string,
    trace = '',
    context = '',
    isTimeDiffEnabled = true,
  ): void {
    this.printMessage(message, clc.red, context, isTimeDiffEnabled);
    this.printStackTrace(trace);
  }

  static warn(message: string, context = '', isTimeDiffEnabled = true): void {
    this.printMessage(message, clc.yellow, context, isTimeDiffEnabled);
  }

  static debug(message: string, context = '', isTimeDiffEnabled = true): void {
    this.printMessage(message, clc.magentaBright, context, isTimeDiffEnabled);
  }

  static verbose(
    message: string,
    context = '',
    isTimeDiffEnabled = true,
  ): void {
    this.printMessage(message, clc.cyanBright, context, isTimeDiffEnabled);
  }

  private callFunction(
    name: 'log' | 'warn' | 'debug' | 'verbose',
    message: string,
    context?: string,
  ): void {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }

    // Construct the request ID to include in the context
    const reqId = httpContext.get('traceId')
      ? ` - ${httpContext.get('traceId')}`
      : '';

    const instance = this.getInstance();
    const func = instance && (instance as typeof Logger)[name];
    func &&
      func.call(
        instance,
        message,
        (context || this.context) + reqId,
        this.isTimestampEnabled,
      );
  }

  private getInstance(): typeof Logger | LoggerService {
    const { instance } = Logger;
    return instance === this ? Logger : instance;
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return Logger.logLevels.includes(level);
  }

  private static printMessage(
    message: string,
    color: (message: string) => string,
    context = '',
    isTimeDiffEnabled?: boolean,
  ): void {
    const _color = colorize ? color : colorless;
    const output = isObject(message)
      ? `${_color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
      : _color(message);

    // Timestamp to include the milliseconds
    const timestamp = new Date(Date.now()).toISOString();

    const contextMessage = context ? _yellow(`[${context}] `) : '';
    const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);

    process.stdout.write(
      `${timestamp} ${contextMessage}${output}${timestampDiff}\n`,
    );
  }

  private static updateAndGetTimestampDiff(
    isTimeDiffEnabled?: boolean,
  ): string {
    const includeTimestamp = Logger.lastTimestamp && isTimeDiffEnabled;
    const result = includeTimestamp
      ? _yellow(` +${Date.now() - Logger.lastTimestamp}ms`)
      : '';
    Logger.lastTimestamp = Date.now();
    return result;
  }

  private static printStackTrace(trace: string): void {
    if (!trace) {
      return;
    }
    process.stdout.write(`${trace}\n`);
  }
}
