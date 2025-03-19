import { Provider } from '@nestjs/common';
import { CreatePerson } from './create/create-person';
import { UpdatePerson } from './update/update-person';
import {
  DeletePerson,
} from 'person/application/use-cases/delete/delete-person';
import {
  FindAllPerson,
} from 'person/application/use-cases/find-all/find-all-person';
import {
  FindAutocompletePerson,
} from 'person/application/use-cases/find-autocomplete/find-autocomplete-person';
import {
  FindByUuidPerson,
} from 'person/application/use-cases/find-by-uuid/find-by-uuid-person';

export const useCases: Provider[] = [
  CreatePerson,
  UpdatePerson,
  DeletePerson,
  FindAllPerson,
  FindByUuidPerson,
  FindAutocompletePerson,
];
