import { Person } from '../domain/person';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class PersonRepository {
  abstract create(person: Person): Promise<Person>;

  abstract update(person: Person): Promise<Person>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Person>;

  abstract findOneByUuid(uuid: string): Promise<Person>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Person>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
