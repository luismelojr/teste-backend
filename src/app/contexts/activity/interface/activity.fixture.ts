import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import FixtureHelper from 'shared/test-helpers/fixture-helper';
import PersonBuilder from 'person/infrastructure/person.entity.builder';
import UserBuilder from 'user/infrastructure/user.entity.builder';

const fbc = new FixtureBuilderContainer();

export const fakeData: any = {
  person: {
    phone: '999999999',
  },
  user: {
    username: 'patria',
    email: 'renanc.morais+teste@gmail.com',
  },
};

const fixtures = [
  new PersonBuilder(fbc).with(fakeData.person).mergeOnBuild(fakeData, 'person'),
  new UserBuilder(fbc).with(fakeData.user).withAsync(() => ({
    person: fakeData.person,
  })).mergeOnBuild(fakeData, 'user'),
].map((f) => f.build());

export const loadFixtures = async (dataSource): Promise<void> =>
  await new FixtureHelper().loadFixtures({
    fixtures: [...fixtures],
    dataSource,
  });
