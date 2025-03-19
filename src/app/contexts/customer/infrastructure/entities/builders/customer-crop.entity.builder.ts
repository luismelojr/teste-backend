import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { faker } from '@faker-js/faker/locale/pt_PT';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'customer_crops',
    data: {
      id: c.customerCropId,
      uuid: generateUuidV4(),
      customer: { id: c.customerId },
      identification: faker.commerce.department(),
      status: CropCustomerStatusEnum.PLANTED,
      cultivation: { id: c.cultivationId },
      plantingDate: new Date('2025-09-15'),
      harvestDate: new Date('2026-03-20'),
      crop: { id: c.cropId },
      plantedAreaHectares: 200,
      averageProductivity: 50,
      conservativeProductivity: 40,
      expectedTotalProduction: 10000,
      nitrogenPercentage: 10,
      phosphorusPercentage: 5,
      potassiumPercentage: 7,
      ammoniumSulfatePercentage: 3,
      defensivePercentage: 2,
      seedPercentage: 8,
      totalSoldBags: 5000,
      totalSoldPercentage: 50,
      averageSalesValue: 20,
    },
  };
};

export default class CustomerCropEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCustomerCrop();
    this.object = getDefaultObject(fixtureContainer);
  }
}
