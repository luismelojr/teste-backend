import { EventType } from '../domain/event-type';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
    PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class EventTypeRepository {
    abstract create(eventType: EventType): Promise<EventType>;

    abstract update(eventType: EventType): Promise<EventType>;

    abstract delete(uuid: UUID): Promise<void>;

    abstract findOneById(id: EntityPrimaryKey): Promise<EventType>;

    abstract findOneByUuid(uuid: string): Promise<EventType>;

    abstract findAll({ pagination, searchText }: {
        pagination: PaginationInput,
        searchText?: string,
    }): Promise<PaginationOutput<EventType>>;

    abstract findAutocomplete(query: string): Promise<any[]>;
}
