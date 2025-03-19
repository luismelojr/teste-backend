import { DataSource } from 'typeorm';
import FixtureHelper from 'shared/test-helpers/fixture-helper';

interface FixtureLoaderProps {
  dataSource: DataSource;
}

export const FixtureLoader = ({ dataSource }: FixtureLoaderProps) => {
  return {
    load: async (fixtures) => {
      await dataSource.initialize();
      await new FixtureHelper().loadFixtures({ fixtures, dataSource });
      await dataSource.destroy();
    },
  };
};
