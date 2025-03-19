import { Provider } from '@nestjs/common';
import { CreateOccupation } from './create/create-occupation';
import { UpdateOccupation } from './update/update-occupation';
import {
  FindAutocompleteOccupation,
} from './find-autocomplete/find-autocomplete-occupation';
import {
  FindByUuidOccupation,
} from './find-by-uuid/find-by-uuid-occupation';
import {
  FindAllOccupation,
} from './find-all/find-all-occupation';
import {
  DeleteOccupation,
} from './delete/delete-occupation';

export const useCases: Provider[] = [
  CreateOccupation,
  UpdateOccupation,
  DeleteOccupation,
  FindAllOccupation,
  FindByUuidOccupation,
  FindAutocompleteOccupation,
];
