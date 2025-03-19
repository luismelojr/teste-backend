import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'activities',
    data: {
      id: c.activityId,
      uuid: generateUuidV4(),
      name: faker.commerce.productName(),
    },
  };
};

export default class ActivityEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newActivity();
    this.object = getDefaultObject(fixtureContainer);
  }
}
