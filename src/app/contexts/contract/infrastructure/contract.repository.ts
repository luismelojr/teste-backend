import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Contract } from 'contract/domain/contract';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class ContractRepository {
  abstract create(contract: Contract): Promise<Contract>;

  abstract update(contract: Contract): Promise<Contract>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Contract>;

  abstract findOneByUuid(uuid: UUID): Promise<Contract>;

  abstract findAll({
                     pagination,
                     searchText,
                   }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Contract>>;

  abstract findAutocomplete(query: string): Promise<any[]>;

  abstract findByCustomerId(customerId: EntityPrimaryKey): Promise<Contract[]>;
}
