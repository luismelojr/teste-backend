import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import FixtureHelper from 'shared/test-helpers/fixture-helper';
import PersonBuilder from 'person/infrastructure/person.entity.builder';
import UserBuilder from 'user/infrastructure/user.entity.builder';
import OccupationEntityBuilder
  from '../../occupation/infrastructure/occupation.entity.builder';
import ActivityEntityBuilder
  from 'activity/infrastructure/activity.entity.builder';
import CultivationEntityBuilder
  from 'commons/cultivations/infrastructure/cultivation.entity.builder';
import CropEntityBuilder from 'commons/crop/infrastructure/crop.entity.builder';
import CustomerEntityBuilder
  from 'customer/infrastructure/entities/builders/customer.entity.builder';
import CustomerLocationEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-location.entity.builder';
import CustomerActivityEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-activity.entity.builder';
import CustomerCropEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-crop.entity.builder';
import CustomerCropInformationEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-crop-information.entity.builder';
import CustomerPersonEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-person.entity.builder';
import CustomerCropInformationCultivationEntityBuilder
  from 'customer/infrastructure/entities/builders/customer-crop-information-cultivation.entity.builder';

const fbc = new FixtureBuilderContainer();

export const fakeData: any = {
  person: {
    phone: '999999999',
  },
  user: {
    username: 'patria',
    email: 'renanc.morais+teste@gmail.com',
  },
  occupation: {},
  activity: {},
  activity2: {},
  cultivation: {},
  crop: {},
  customer: {
  },

  customerCrop: {},
  customerPerson: {},
  customerActivity: {},
  customerLocation: {},
  customerCropInformation: {},
  customerCropInformationCultivation: {},
};

const fixtures = [
  new PersonBuilder(fbc).with(fakeData.person).mergeOnBuild(fakeData, 'person'),
  new UserBuilder(fbc).with(fakeData.user).mergeOnBuild(fakeData, 'user'),
  new OccupationEntityBuilder(fbc).mergeOnBuild(fakeData, 'occupation'),
  new ActivityEntityBuilder(fbc).mergeOnBuild(fakeData, 'activity'),
  new ActivityEntityBuilder(fbc).mergeOnBuild(fakeData, 'activity2'),
  new CultivationEntityBuilder(fbc).mergeOnBuild(fakeData, 'cultivation'),
  new CropEntityBuilder(fbc).mergeOnBuild(fakeData, 'crop'),

  //Customer
  new CustomerEntityBuilder(fbc).mergeOnBuild(fakeData, 'customer'),
  new CustomerLocationEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerLocation'),
  new CustomerCropEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerCrop'),
  new CustomerPersonEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerPerson'),
  new CustomerActivityEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerActivity'),

  new CustomerCropInformationEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerCropInformation'),
  new CustomerCropInformationCultivationEntityBuilder(fbc).mergeOnBuild(fakeData, 'customerCropInformationCultivation'),

].map((f) => f.build());

export const loadFixtures = async (dataSource): Promise<void> =>
  await new FixtureHelper().loadFixtures({
    fixtures: [...fixtures],
    dataSource,
  });
