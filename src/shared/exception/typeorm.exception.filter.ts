import { Catch, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, TypeORMError } from 'typeorm';
import { ExceptionResponse } from './response.exception';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter {
  constructor(private exceptionResponse: ExceptionResponse) {}

  private annonimyzeMessage(message: string) {
    if (!message) {
      return 'Unexpected error';
    }
    return message?.replace(/\d+/g, '**');
  }

  private getStatusCode(exception: any) {
    if (exception instanceof EntityNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }

  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const message = this.annonimyzeMessage(exception?.message);

    this.exceptionResponse.reply({
      request,
      response,
      statusCode: this.getStatusCode(exception),
      message,
      exception,
      data: exception.detail,
      title: 'TypeOrmException',
    });
  }
}
