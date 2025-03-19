import { Provider } from '@nestjs/common';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  CustomerRepositoryImpl,
} from 'customer/infrastructure/customer.repository.impl';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';
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
  CustomerLocationRepositoryImpl,
} from 'customer/infrastructure/customer-location.repository.impl';
import {
  CustomerLocationRepository,
} from 'customer/infrastructure/customer-location.repository';

export const infrastructure: Provider[] = [
  {
    provide: CustomerEntity,
    useValue: CustomerEntity,
  },
  {
    provide: CustomerActivityEntity,
    useValue: CustomerActivityEntity,
  },
  {
    provide: CustomerCropEntity,
    useValue: CustomerCropEntity,
  },
  {
    provide: CustomerCropInformationEntity,
    useValue: CustomerCropInformationEntity,
  },
  {
    provide: CustomerCropInformationCultivationEntity,
    useValue: CustomerCropInformationCultivationEntity,
  },
  {
    provide: CustomerLocationEntity,
    useValue: CustomerLocationEntity,
  },
  {
    provide: CustomerPersonEntity,
    useValue: CustomerPersonEntity,
  },

  {
    provide: CustomerRepository,
    useClass: CustomerRepositoryImpl,
  },
  {
    provide: CustomerLocationRepository,
    useClass: CustomerLocationRepositoryImpl,
  },
];
