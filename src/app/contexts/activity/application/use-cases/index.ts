import { Provider } from '@nestjs/common';
import { CreateActivity } from './create/create-activity';
import { UpdateActivity } from './update/update-activity';
import {
  FindAutocompleteActivity,
} from 'activity/application/use-cases/find-autocomplete/find-autocomplete-activity';
import {
  FindByUuidActivity,
} from 'activity/application/use-cases/find-by-uuid/find-by-uuid-activity';
import {
  FindAllActivity,
} from 'activity/application/use-cases/find-all/find-all-activity';
import {
  DeleteActivity,
} from 'activity/application/use-cases/delete/delete-activity';

export const useCases: Provider[] = [
  CreateActivity,
  UpdateActivity,
  DeleteActivity,
  FindAllActivity,
  FindByUuidActivity,
  FindAutocompleteActivity,
];
