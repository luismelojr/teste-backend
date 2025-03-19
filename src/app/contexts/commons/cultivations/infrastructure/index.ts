import { Provider } from '@nestjs/common';
import {
  CultivationEntity
} from 'commons/cultivations/infrastructure/cultivation.entity';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import {
  CultivationRepositoryImpl
} from 'commons/cultivations/infrastructure/cultivation.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: CultivationEntity,
    useValue: CultivationEntity
  },
  {
    provide: CultivationRepository,
    useClass: CultivationRepositoryImpl
  }
]
