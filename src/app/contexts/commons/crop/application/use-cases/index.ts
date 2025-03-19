import { Provider } from '@nestjs/common';
import {
  CreateCrop
} from 'commons/crop/application/use-cases/create/create-crop';
import {
  FindByUuidCrop
} from 'commons/crop/application/use-cases/find-by-uuid/find-by-uuid-crop';
import {
  FindAllCrop
} from 'commons/crop/application/use-cases/find-all/find-all-crop';
import {
  DeleteCrop
} from 'commons/crop/application/use-cases/delete/delete-crop';
import {
  UpdateCrop
} from 'commons/crop/application/use-cases/update/update-crop';
import {
  FindAutocompleteCrop
} from 'commons/crop/application/use-cases/find-autocomplete/find-autocomplete-crop';

export const useCases: Provider[] = [
  CreateCrop,
  FindByUuidCrop,
  FindAllCrop,
  DeleteCrop,
  UpdateCrop,
  FindAutocompleteCrop
]
