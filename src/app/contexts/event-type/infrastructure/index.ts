import { Provider } from '@nestjs/common';
import { EventTypeEntity } from 'event-type/infrastructure/event-type.entity';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventTypeRepositoryImpl } from 'event-type/infrastructure/event-type.repository.impl';

export const infrastructure: Provider[] = [
    {
        provide: EventTypeEntity,
        useValue: EventTypeEntity,
    },
    {
        provide: EventTypeRepository,
        useClass: EventTypeRepositoryImpl,
    },
];
