import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getTestModule } from 'shared/test-helpers/integration-test-module';

export interface IntegrationTestContext {
  app: INestApplication;
  dataSource: DataSource;
  cleanup: () => Promise<void>;
}

export async function setupIntegrationTest(
  loadFixtures: (dataSource: DataSource) => Promise<void>,
): Promise<IntegrationTestContext> {
  const { moduleApp, moduleDataSource } = await getTestModule();

  await loadFixtures(moduleDataSource);

  return {
    app: moduleApp,
    dataSource: moduleDataSource,
    cleanup: async function () {
      await moduleApp.close();
    },
  } as IntegrationTestContext;
}
