import { Occupation } from '../domain/occupation';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class OccupationRepository {
  abstract create(occupation: Occupation): Promise<Occupation>;

  abstract update(occupation: Occupation): Promise<Occupation>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Occupation>;

  abstract findOneByUuid(uuid: string): Promise<Occupation>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Occupation>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
