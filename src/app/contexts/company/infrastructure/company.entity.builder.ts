import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'companies',
    data: {
      id: c.companyId,
      uuid: generateUuidV4(),
      name: faker.company.name(),
      tradeName: faker.company.name(),
      cnpj: '90798163000154',
      phone: faker.phone.number(),
      city: {
        id: 5208707,
      },
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
    },
  };
};

export default class CompanyEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCompany();
    this.object = getDefaultObject(fixtureContainer);
  }
}
