import {
  INestApplication,
  Module,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { getTypeOrmConfig, TYPEORM_CONFIG_NAME } from 'shared/typeorm/typeorm';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getEnvFilePath } from 'shared/config/env';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import {
  LoggerConfigService,
} from 'shared/config/logger/logger-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from 'shared/interceptors/response.interceptor';
import { LoggingInterceptor } from 'shared/interceptors/logger.interceptor';
import { AllExceptionFilter } from 'shared/exception/common.exception.filter';
import { ExceptionResponse } from 'shared/exception/response.exception';
import { HttpAdapterHost } from '@nestjs/core';
import {
  TypeOrmExceptionFilter,
} from 'shared/exception/typeorm.exception.filter';
import { modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
      load: [registerAs(TYPEORM_CONFIG_NAME, getTypeOrmConfig)],
    }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(TYPEORM_CONFIG_NAME),
    }),
    WinstonModule.forRootAsync({
      imports: undefined,
      inject: [ConfigService],
      useClass: LoggerConfigService,
    }),
    ...modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}

export function configureApp(app: INestApplication): void {
  app.use(helmet());
  app.enableCors({
    origin: [
      'https://main.d3eeznor2dpaoz.amplifyapp.com',
      'http://localhost:4000',
      'https://painel.patria.agr.br',
      'https://www.painel.patria.agr.br',
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  configureInterceptors(app);
  configureSwagger(app);
  configureFilterExceptions(app);
}

function configureInterceptors(app: INestApplication): void {
  app.useGlobalInterceptors(
    new LoggingInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
}

function configureFilterExceptions(app: INestApplication): void {
  app.useGlobalFilters(
    new AllExceptionFilter(
      new ExceptionResponse(
        app.get(WINSTON_MODULE_NEST_PROVIDER),
        app.get(HttpAdapterHost),
      ),
    ),
  );
  app.useGlobalFilters(
    new TypeOrmExceptionFilter(
      new ExceptionResponse(
        app.get(WINSTON_MODULE_NEST_PROVIDER),
        app.get(HttpAdapterHost),
      ),
    ),
  );
}

function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Api Pátria Agronegócio')
    .setDescription('Documentação api Pátria Agronegócio Backend Nest')
    .setVersion('1.0')
    .addSecurity('Authorization', {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
