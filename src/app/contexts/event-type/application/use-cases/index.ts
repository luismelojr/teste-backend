import { Provider } from '@nestjs/common';
import { CreateEventType } from './create/create-event-type';
import { UpdateEventType } from './update/update-event-type';
import {
  FindAutocompleteEventType,
} from 'event-type/application/use-cases/find-autocomplete/find-autocomplete-event-type';
import {
  FindByUuidEventType,
} from 'event-type/application/use-cases/find-by-uuid/find-by-uuid-event-type';
import {
  FindAllEventType,
} from 'event-type/application/use-cases/find-all/find-all-event-type';
import {
  DeleteEventType,
} from 'event-type/application/use-cases/delete/delete-event-type';

export const useCases: Provider[] = [
  CreateEventType,
  UpdateEventType,
  DeleteEventType,
  FindAllEventType,
  FindByUuidEventType,
  FindAutocompleteEventType,
];
