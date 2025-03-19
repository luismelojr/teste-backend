import { Company } from '../domain/company';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class CompanyRepository {
  abstract create(company: Company): Promise<Company>;

  abstract update(company: Company): Promise<Company>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Company>;

  abstract findOneByUuid(uuid: string): Promise<Company>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Company>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
