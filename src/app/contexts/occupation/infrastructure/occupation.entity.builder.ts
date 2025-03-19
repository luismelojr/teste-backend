import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'occupations',
    data: {
      id: c.occupationId,
      uuid: generateUuidV4(),
      name: faker.commerce.productName(),
    },
  };
};

export default class OccupationEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newOccupation();
    this.object = getDefaultObject(fixtureContainer);
  }
}
