import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'event_types',
    data: {
      id: c.eventTypeId,
      uuid: generateUuidV4(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    },
  };
};

export default class EventTypeEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newEventType();
    this.object = getDefaultObject(fixtureContainer);
  }
}
