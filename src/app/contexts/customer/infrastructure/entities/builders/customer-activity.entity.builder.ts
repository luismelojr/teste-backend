import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_activities',
    data: {
      id: c.customerActivityId,
      uuid: generateUuidV4(),
      customer: { id: c.customerId },
      activity: { id: c.activityId },
    },
  };
};

export default class CustomerActivityEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerActivity();
    this.object = getDefaultObject(fixtureContainer);
  }
}
