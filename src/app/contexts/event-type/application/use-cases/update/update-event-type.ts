import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';

interface executeCommand {
  uuid: UUID;
  name: string,
  description?: string,
}

@Injectable()
export class UpdateEventType extends UseCase {
  constructor(
    @Inject(EventTypeRepository)
    protected repository: EventTypeRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const {
      uuid,
      name,
      description,
    } = command;

    const eventTypeDb = await this.repository.findOneByUuid(uuid);

    if (!eventTypeDb) throw new NotFoundException('event type is not found');

    const eventType = new EventType({
      id: eventTypeDb.id,
      uuid,
      name,
      description,
    });

    const saved = await this.repository.update(eventType);

    return {
      uuid: saved.uuid,
      name: saved.name,
      description: saved.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
