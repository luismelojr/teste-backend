import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule, configureApp } from '../../app.module';
import { VersioningType } from '@nestjs/common';
import { AuthService } from 'auth/aplication/auth.service';
import { AuthMockService } from 'shared/test-helpers/auth-mock.helper';

export const getTestModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(AuthService)
    .useValue(AuthMockService)
    .compile();

  const app = moduleRef.createNestApplication();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const dataSource = moduleRef.get<DataSource>(DataSource);
  configureApp(app);
  await app.init();

  return {
    moduleApp: app,
    moduleDataSource: dataSource,
  };
};
