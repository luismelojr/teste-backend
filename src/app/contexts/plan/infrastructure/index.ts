import { Provider } from '@nestjs/common';
import { PlanEntity } from 'plan/infrastructure/entities/plan.entity';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { PlanRepositoryImpl } from 'plan/infrastructure/plan.repository.impl';
import {
  PlanFunctionEntity,
} from 'plan/infrastructure/entities/plan-function.entity';

export const infrastructure: Provider[] = [
  {
    provide: PlanEntity,
    useValue: PlanEntity,
  },
  {
    provide: PlanFunctionEntity,
    useValue: PlanFunctionEntity,
  },
  {
    provide: PlanRepository,
    useClass: PlanRepositoryImpl,
  },
];
