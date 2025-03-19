import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'crops',
    data: {
      id: c.cropId,
      uuid: generateUuidV4(),
      name: 'Summer Crop',
      type: CropTypeEnum.SUMMER,
      start: 2025,
      end: 2026,
    },
  };
};

export default class CropEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newCrop();
    this.object = getDefaultObject(fixtureContainer);
  }
}
