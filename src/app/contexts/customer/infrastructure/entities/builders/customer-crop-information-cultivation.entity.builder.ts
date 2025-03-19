import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_crop_information_cultivations',
    data: {
      id: c.customerCropInformationCultivationId,
      uuid: generateUuidV4(),
      customerCropInformation: { id: c.customerCropInformationCultivationId },
      cultivation: { id: c.cultivationId },
    },
  };
};

export default class CustomerCropInformationCultivationEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerCropInformationCultivation();
    this.object = getDefaultObject(fixtureContainer);
  }
}
