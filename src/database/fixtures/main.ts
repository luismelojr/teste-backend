import dataSource from '../../shared/typeorm/datasource';
import { FixtureLoader } from './fixture-loader';
import { FixtureBuilder } from './fixture-builder';
import { seedDatabase } from 'database/fixtures/run-seeds-from-sql';

(async function main() {
  await seedDatabase(dataSource);

  const fixtures = FixtureBuilder();
  const fixtureLoader = FixtureLoader({ dataSource });
  await fixtureLoader.load(fixtures);
})();
