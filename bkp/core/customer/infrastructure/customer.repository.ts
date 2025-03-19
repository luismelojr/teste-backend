import { Customer } from '../domain/customer';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { PaginationOutput } from 'shared/abstracts/paginations/pagination.output';

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<Customer>;

  abstract update(customer: Customer): Promise<Customer>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneByUuid(uuid: UUID): Promise<Customer>;

  abstract findAll({
                     pagination,
                     searchText,
                   }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Customer>>;

  abstract findAutoComplete(query: string): Promise<any[]>;
}
