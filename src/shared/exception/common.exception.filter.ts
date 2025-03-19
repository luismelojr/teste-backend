import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ExceptionResponse } from './response.exception';
import { ValidationError } from './validation-error.exception';

interface IError {
  title?: string;
  message: string;
  statusCode: number;
  data?: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private exceptionResponse: ExceptionResponse) {}

  private getMessage(exception: any) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as IError;
      const responseMessage = Array.isArray(response?.message)
        ? response.message
        : [response?.message];
      return {
        ...response,
        message: responseMessage.join(', '),
        statusCode: exception.getStatus(),
        title: exception.name,
      };
    }
    if (exception instanceof ValidationError)
      return {
        title: exception.title,
        message: exception.message,
        statusCode: exception.statusCode,
        data: exception.data,
      };
    return {
      title: 'Unexpected error',
      message: (exception as Error).message,
      statusCode: this.getStatusCode(exception),
    };
  }

  private getStatusCode(exception: any) {
    if (exception instanceof HttpException) return exception.getStatus();
    if (exception instanceof ValidationError) return exception.statusCode;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();
    const statusCode = this.getStatusCode(exception);
    const message = this.getMessage(exception);

    this.exceptionResponse.reply({
      request,
      response,
      statusCode,
      ...message,
      exception,
    });
  }
}
