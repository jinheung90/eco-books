import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { utilities, WinstonModule } from 'nest-winston';
import { EnvironmentName } from '@eco-books/type-common';
const dailyOption = (level: string) => {
  return {
    level: level,
    filename: `application-${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '90d',
    dirname: '/var/log/app',
    format: winston.format.json(),
  };
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(process.env['NODE_ENV'], {
      colors: true,
      prettyPrint: true,
    })
  ),
});



export const dailyRotateLogger = WinstonModule.createLogger({
  level: 'info',
  transports: [
    EnvironmentName.LOCAL === process.env['APP_ENV'] ? consoleTransport : null,
    new winston.transports.DailyRotateFile(
      dailyOption(winston.config.npm.levels.verbose.toString()),
    ),
    new winston.transports.DailyRotateFile(
      dailyOption(winston.config.npm.levels.error.toString()),
    ),
  ],
});
