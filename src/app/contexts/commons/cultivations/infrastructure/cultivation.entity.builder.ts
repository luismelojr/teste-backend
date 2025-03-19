import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'cultivations',
    data: {
      id: c.cultivationId,
      uuid: generateUuidV4(),
      name: faker.commerce.productName(),
    },
  };
};

export default class CultivationEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCultivation();
    this.object = getDefaultObject(fixtureContainer);
  }
}
