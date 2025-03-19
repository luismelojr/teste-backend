import { Provider } from '@nestjs/common';
import { ActivityEntity } from 'activity/infrastructure/activity.entity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import {
  ActivityRepositoryImpl,
} from 'activity/infrastructure/activity.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: ActivityEntity,
    useValue: ActivityEntity,
  },
  {
    provide: ActivityRepository,
    useClass: ActivityRepositoryImpl,
  },
];
