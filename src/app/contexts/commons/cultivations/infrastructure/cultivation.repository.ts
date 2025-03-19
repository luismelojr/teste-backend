import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Cultivation } from 'commons/cultivations/domain/cultivation';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class CultivationRepository {
  abstract create(cultivation: Cultivation): Promise<Cultivation>;

  abstract update(cultivation: Cultivation): Promise<Cultivation>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Cultivation>;

  abstract findOneByUuid(uuid: string): Promise<Cultivation>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Cultivation>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
