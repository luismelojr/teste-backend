import { Provider } from '@nestjs/common';
import { CreateCustomer } from './create/create-customer';
import { DeleteCustomer } from './delete/delete-customer';
import { FindAllCustomer } from './find-all/find-all-customer';
import { FindByUuidCustomer } from './find-by-uuid/find-by-uuid-customer';
import {
  FindAutocompleteCustomer
} from './find-autocomplete/find-autocomplete-customer';
import { UpdateCustomer } from './update/update-customer';

export const useCases: Provider[] = [
  CreateCustomer,
  DeleteCustomer,
  FindAllCustomer,
  FindByUuidCustomer,
  FindAutocompleteCustomer,
  UpdateCustomer
]
