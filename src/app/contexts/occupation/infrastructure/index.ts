import { Provider } from '@nestjs/common';
import { OccupationEntity } from './occupation.entity';
import {
  OccupationRepository,
} from './occupation.repository';
import {
  OccupationRepositoryImpl,
} from './occupation.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: OccupationEntity,
    useValue: OccupationEntity,
  },
  {
    provide: OccupationRepository,
    useClass: OccupationRepositoryImpl,
  },
];
