import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';

interface executeCommand {
    uuid: UUID;
}

@Injectable()
export class DeleteEventType extends UseCase {
    constructor(
        @Inject(EventTypeRepository)
        protected repository: EventTypeRepository,
    ) {
        super();
    }

    async execute(
        command: executeCommand,
    ) {
        const { uuid } = command;

        if (!uuid) throw new BadRequestException('uuid is required');

        const eventTypeDb = await this.repository.findOneByUuid(uuid);

        if (!eventTypeDb) throw new NotFoundException('eventType not found');

        await this.repository.delete(uuid);

    }
}
