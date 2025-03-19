import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteEventType extends UseCase {
  constructor(
    @Inject(EventTypeRepository)
    protected repository: EventTypeRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { query } = command;
    return await this.repository.findAutocomplete(query);
  }
}

type Output = {
  uuid: UUID;
  name: string;
}[];
