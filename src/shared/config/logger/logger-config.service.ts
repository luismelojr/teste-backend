import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import { format, transports } from 'winston';

const { colorize, combine, timestamp, printf } = format;

interface LoggerEnvs {
  LOG_LEVEL: string;
}

@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<LoggerEnvs>) {
  }

  createWinstonModuleOptions():
    | WinstonModuleOptions
    | Promise<WinstonModuleOptions> {
    return {
      level: process.env.NODE_ENV === 'test' ? 'info' : 'info',
      format: process.env.NODE_ENV === 'production'
        ? format.combine(timestamp(), format.json())
        : combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          printf(({ level, message, timestamp, context }) =>
            `[${timestamp}] [${level}] ${context || ''} ${message}`,
          ),
        ),
      transports: [new transports.Console({
        silent: process.env.NODE_ENV === 'test',
      })],
    };
  }
}
