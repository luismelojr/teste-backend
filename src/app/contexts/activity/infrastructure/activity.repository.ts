import { Activity } from '../domain/activity';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class ActivityRepository {
  abstract create(activity: Activity): Promise<Activity>;

  abstract update(activity: Activity): Promise<Activity>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Activity>;

  abstract findOneByUuid(uuid: string): Promise<Activity>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Activity>>;

  abstract findAutocomplete(query: string): Promise<any[]>;
}
