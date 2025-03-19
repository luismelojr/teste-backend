import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class ResponseError {
  title?: string;
  message: string;
  statusCode: number;
  data?: any;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable()
export class ExceptionResponse {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private httpAdapterHost: HttpAdapterHost,
  ) {}

  private logMessage(
    request: any,
    message: string,
    status: number,
    exception: any,
  ) {
    const pathLog = `End Request for ${request.path}`;
    const messageLog = `method=${request.method} status=${status} code_error=${status} message=${message}`;
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(pathLog, messageLog, exception.stack);
    } else {
      this.logger.warn(pathLog, messageLog, exception?.stack);
    }
  }

  reply({
    request,
    response,
    statusCode,
    message,
    exception,
    data,
    title,
  }: any): void {
    const { httpAdapter } = this.httpAdapterHost;
    const error: ResponseError = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.path,
      message,
      title,
      data,
      method: request.method,
    };

    this.logMessage(request, message, statusCode, exception);
    httpAdapter.reply(response, error, statusCode);
  }
}
