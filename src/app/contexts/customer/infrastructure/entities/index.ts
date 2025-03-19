import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import {
  CustomerCropInformationCultivationEntity,
} from 'customer/infrastructure/entities/customer-crop-information-cultivation.entity';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';

export const entities: any[] = [
  CustomerEntity,
  CustomerActivityEntity,
  CustomerCropEntity,
  CustomerCropInformationEntity,
  CustomerCropInformationCultivationEntity,
  CustomerLocationEntity,
  CustomerPersonEntity,
];
