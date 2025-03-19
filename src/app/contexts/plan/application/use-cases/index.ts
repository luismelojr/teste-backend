import { Provider } from '@nestjs/common';
import { CreatePlan } from './create/create-plan';
import { UpdatePlan } from './update/update-plan';
import {
  FindAutocompletePlan,
} from 'plan/application/use-cases/find-autocomplete/find-autocomplete-plan';
import {
  FindByUuidPlan,
} from 'plan/application/use-cases/find-by-uuid/find-by-uuid-plan';
import {
  FindAllPlan,
} from 'plan/application/use-cases/find-all/find-all-plan';
import { DeletePlan } from 'plan/application/use-cases/delete/delete-plan';

export const useCases: Provider[] = [
  CreatePlan,
  UpdatePlan,
  DeletePlan,
  FindAllPlan,
  FindByUuidPlan,
  FindAutocompletePlan,
];
