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
export class FindByUuidEventType extends UseCase {
  constructor(
    @Inject(EventTypeRepository)
    protected repository: EventTypeRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const eventType = await this.repository.findOneByUuid(uuid);

    if (!eventType) throw new NotFoundException('event type is not found');

    return {
      uuid: eventType.uuid,
      name: eventType.name,
      description: eventType.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
