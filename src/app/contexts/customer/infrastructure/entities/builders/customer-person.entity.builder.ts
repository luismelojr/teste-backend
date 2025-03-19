import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_persons',
    data: {
      id: c.customerPersonId,
      uuid: generateUuidV4(),
      customer: { id: c.customerId },
      person: { id: c.personId },
      occupation: { id: c.occupationId },
    },
  };
};
export default class CustomerPersonEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerPerson();
    this.object = getDefaultObject(fixtureContainer);
  }
}
