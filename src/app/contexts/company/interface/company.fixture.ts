import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import FixtureHelper from 'shared/test-helpers/fixture-helper';
import CompanyEntityBuilder from '../infrastructure/company.entity.builder';

const fbc = new FixtureBuilderContainer();

export const fakeData: any = {
  company: {},
};

const fixtures = [
  new CompanyEntityBuilder(fbc).mergeOnBuild(fakeData, 'company'),
].map((f) => f.build());

export const loadFixtures = async (dataSource): Promise<void> =>
  await new FixtureHelper().loadFixtures({
    fixtures: [...fixtures],
    dataSource,
  });
