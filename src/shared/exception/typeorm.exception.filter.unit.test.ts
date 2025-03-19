import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { TypeOrmExceptionFilter } from './typeorm.exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { ExceptionResponse } from './response.exception';

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const mockGetRequest = jest.fn().mockImplementation(() => ({
  path: '/test',
  method: 'POST',
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let service: TypeOrmExceptionFilter;
  let adapter: HttpAdapterHost;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmExceptionFilter,
        HttpAdapterHost,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockAppLoggerService,
        },
        ExceptionResponse,
      ],
    }).compile();
    service = module.get<TypeOrmExceptionFilter>(TypeOrmExceptionFilter);
    adapter = module.get<HttpAdapterHost>(HttpAdapterHost);

    adapter.httpAdapter = {
      reply: jest.fn(),
    } as any;
  });

  describe('Typeorm exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Query failed error', () => {
      service.catch(
        new QueryFailedError('query', [], new Error('1err12or 1message111')),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
      expect(adapter.httpAdapter.reply).toHaveBeenCalledWith(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        {
          path: '/test',
          message: '**err**or **message**',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: expect.any(String),
          data: undefined,
          title: 'TypeOrmException',
          method: 'POST',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    });
  });
});
