import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customers',
    data: {
      id: c.customerId,
      uuid: generateUuidV4(),
      identifier: 'Client LTDA',
      groupIdentifier: 'G001',
      description: 'Descrição marota',
      financialTools: false,
      receivesLandRent: false,
      grainConsumer: false,
      ownGrain: false,
      receiveThirdGrains: false,
      annualQuantity: 0,
    },
  };
};

export default class CustomerEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomer();
    this.object = getDefaultObject(fixtureContainer);
  }
}
