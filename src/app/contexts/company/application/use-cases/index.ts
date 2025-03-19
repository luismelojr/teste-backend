import { Provider } from '@nestjs/common';
import { CreateCompany } from './create/create-company';
import { UpdateCompany } from './update/update-company';
import {
  FindAutocompleteCompany,
} from 'company/application/use-cases/find-autocomplete/find-autocomplete-company';
import {
  FindByUuidCompany,
} from 'company/application/use-cases/find-by-uuid/find-by-uuid-company';
import {
  FindAllCompany,
} from 'company/application/use-cases/find-all/find-all-company';
import {
  DeleteCompany,
} from 'company/application/use-cases/delete/delete-company';

export const useCases: Provider[] = [
  CreateCompany,
  UpdateCompany,
  DeleteCompany,
  FindAllCompany,
  FindByUuidCompany,
  FindAutocompleteCompany,
];
