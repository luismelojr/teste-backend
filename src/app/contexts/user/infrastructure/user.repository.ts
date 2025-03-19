import { User } from '../domain/user';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class UserRepository {
  abstract create(person: User): Promise<User>;

  abstract update(person: User): Promise<User>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneByUsername(email: string): Promise<User>;

  abstract findOneById(id: EntityPrimaryKey): Promise<User>;

  abstract findOneByUuid(uuid: string): Promise<User>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<User>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
