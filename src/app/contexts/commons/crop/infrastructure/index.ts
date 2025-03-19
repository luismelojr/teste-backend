import { Provider } from '@nestjs/common';
import { CropEntity } from 'commons/crop/infrastructure/crop.entity';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import {
  CropRepositoryImpl
} from 'commons/crop/infrastructure/crop.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: CropEntity,
    useClass: CropEntity,
  },
  {
    provide: CropRepository,
    useClass: CropRepositoryImpl,
  }
];
