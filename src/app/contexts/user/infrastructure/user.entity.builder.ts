import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'users',
    data: {
      id: c.userId,
      uuid: generateUuidV4(),
      cognitoId: generateUuidV4(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      person: { id: c.personId },
    },
  };
};

export default class UserEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newUser();
    this.object = getDefaultObject(fixtureContainer);
  }
}
