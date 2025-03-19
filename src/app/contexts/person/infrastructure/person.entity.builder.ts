import { faker } from '@faker-js/faker/locale/pt_PT';
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { PersonGenderType } from 'enumerates/person-gender-type';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'persons',
    data: {
      id: c.personId,
      uuid: generateUuidV4(),
      name: faker.person.firstName(),
      cpf: '61765766443',
      phone: '999999999',
      city: {
        id: 5208707,
      },
      address: faker.location.streetAddress(),
      gender: PersonGenderType.MALE,
    },
  };
};

export default class PersonEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newPerson();
    this.object = getDefaultObject(fixtureContainer);
  }
}
