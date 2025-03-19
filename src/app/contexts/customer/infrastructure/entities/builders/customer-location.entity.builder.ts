import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { faker } from '@faker-js/faker/locale/pt_PT';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_locations',
    data: {
      id: c.customerLocationId,
      uuid: generateUuidV4(),
      customer: { id: c.customerId },
      name: faker.location.street(),
      address: faker.location.streetAddress(),
      latitude: -23.55052,
      longitude: -46.633308,
      totalHectares: 0,
    },
  };
};
export default class CustomerLocationEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerLocation();
    this.object = getDefaultObject(fixtureContainer);
  }
}
