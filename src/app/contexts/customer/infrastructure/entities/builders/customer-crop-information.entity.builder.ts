import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_crop_information',
    data: {
      id: c.customerCropInformationId,
      uuid: generateUuidV4(),
      customer: { id: c.customerId },
      typeCrop: CropTypeEnum.SUMMER,
      plantingSeasonStart: new Date('2025-09-01'),
      plantingSeasonEnd: new Date('2025-12-01'),
      harvestSeasonStart: new Date('2026-03-01'),
      harvestSeasonEnd: new Date('2026-06-01'),
    },
  };
};

export default class CustomerCropInformationEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerCropInformation();
    this.object = getDefaultObject(fixtureContainer);
  }
}
