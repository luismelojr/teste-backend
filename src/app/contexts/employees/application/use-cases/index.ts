import { Provider } from '@nestjs/common';
import { CreateEmployee } from './create/create-employee';
import { DeleteEmployee } from './delete/delete-employee';
import { FindAllEmployee } from './find-all/find-all-employee';
import {
  FindAutocompleteEmployee
} from './find-autocomplete/find-autocomplete-employee';
import { UpdateEmployee } from './update/update-employee';
import { FindOneByUuidEmployee } from './find-by-uuid/find-by-uuid-employee';

export const useCases: Provider[] = [
  CreateEmployee,
  DeleteEmployee,
  FindAllEmployee,
  FindAutocompleteEmployee,
  UpdateEmployee,
  FindOneByUuidEmployee
];
