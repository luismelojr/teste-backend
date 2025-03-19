import { Provider } from '@nestjs/common';
import {
  CreateCultivation
} from 'commons/cultivations/application/use-cases/create/create-cultivation';
import {
  DeleteCultivation
} from 'commons/cultivations/application/use-cases/delete/delete-cultivation';
import {
  FindAllCultivation
} from 'commons/cultivations/application/use-cases/find-all/find-all-cultivation';
import {
  FindAutocompleteCultivation
} from 'commons/cultivations/application/use-cases/find-autocomplete/find-autocomplete-cultivation';
import {
  FindByUuidCultivation
} from 'commons/cultivations/application/use-cases/find-by-uuid/find-by-uuid-cultivation';
import {
  UpdateCultivation
} from 'commons/cultivations/application/use-cases/update/update-cultivation';

export const useCases: Provider[] = [
  CreateCultivation,
  DeleteCultivation,
  FindAllCultivation,
  FindAutocompleteCultivation,
  FindByUuidCultivation,
  UpdateCultivation
]
