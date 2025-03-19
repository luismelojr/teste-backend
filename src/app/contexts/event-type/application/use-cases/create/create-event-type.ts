import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { EventType } from 'event-type/domain/event-type';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';

interface executeCommand {
  name: string,
}

@Injectable()
export class CreateEventType extends UseCase {
  constructor(
      @Inject(EventTypeRepository)
      protected repository: EventTypeRepository,
  ) {
    super();
  }

  async execute(
      command: executeCommand,
  ): Promise<Output> {
    const { name } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }

    const eventType = EventType.create(name);

    const saved = await this.repository.create(eventType);

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
