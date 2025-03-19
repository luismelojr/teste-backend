import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AllExceptionFilter } from './common.exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from './response.exception';
import { ValidationError } from 'shared/exception/validation-error.exception';

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
  message: 'test',
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
  let service: AllExceptionFilter;
  let adapter: HttpAdapterHost;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionFilter,
        HttpAdapterHost,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockAppLoggerService,
        },
        ExceptionResponse,
      ],
    }).compile();
    service = module.get<AllExceptionFilter>(AllExceptionFilter);
    adapter = module.get<HttpAdapterHost>(HttpAdapterHost);

    adapter.httpAdapter = {
      reply: jest.fn(),
    } as any;
  });

  describe('exception filter Validation Error', () => {
    it('Validation Error', () => {
      service.catch(
        new ValidationError({
          data: 'FAILED_DEPENDENCY',
          message: 'reboot now',
          statusCode: HttpStatus.FAILED_DEPENDENCY,
          title: 'Reboot',
        }),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
      expect(adapter.httpAdapter.reply).toHaveBeenCalledWith(
        {
          message: 'test',
        },
        {
          data: 'FAILED_DEPENDENCY',
          title: 'Reboot',
          path: '/test',
          message: 'reboot now',
          statusCode: HttpStatus.FAILED_DEPENDENCY,
          timestamp: expect.any(String),
          method: 'POST',
        },
        HttpStatus.FAILED_DEPENDENCY,
      );
    });
  });
  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http exception', () => {
      service.catch(
        new BadRequestException('Http exception'),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
      expect(adapter.httpAdapter.reply).toHaveBeenCalledWith(
        {
          message: 'test',
        },
        {
          data: undefined,
          title: 'BadRequestException',
          path: '/test',
          message: 'Http exception',
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: expect.any(String),
          method: 'POST',
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    it('Other errors', () => {
      service.catch(new Error('Other exception'), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
      expect(adapter.httpAdapter.reply).toHaveBeenCalledWith(
        {
          message: 'test',
        },
        {
          path: '/test',
          message: 'Other exception',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: expect.any(String),
          data: undefined,
          title: 'Unexpected error',
          method: 'POST',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
