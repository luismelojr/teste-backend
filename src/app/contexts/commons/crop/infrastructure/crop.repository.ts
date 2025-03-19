import { Crop } from 'commons/crop/domain/crop';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput
} from 'shared/abstracts/paginations/pagination.output';
import { UUID } from 'shared/types/uuid';

export abstract class CropRepository {
  abstract create(crop: Crop): Promise<Crop>
  abstract findOneByUuid(uuid: UUID): Promise<Crop>
  abstract findAll({pagination, searchText}: {pagination: PaginationInput, searchText?: string}): Promise<PaginationOutput<Crop>>
  abstract delete(uuid: UUID): Promise<void>
  abstract update(crop: Crop): Promise<Crop>
  abstract findAutocomplete(query: string): Promise<any[]>;
}
