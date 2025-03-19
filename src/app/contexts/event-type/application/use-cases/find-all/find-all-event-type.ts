import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllEventType extends UseCase {
  constructor(
      @Inject(EventTypeRepository)
      protected repository: EventTypeRepository,
  ) {
    super();
  }

  outputAdapter(result): eventTypeDto[] {
    return result.data.map((eventType) => {
      return {
        uuid: eventType.uuid,
        name: eventType.name,
        description: eventType.description,
      };
    });
  }

  async execute(
      command: executeCommand,
  ): Promise<Output> {
    const { pagination, searchText } = command;

    const result = await this.repository.findAll({
      pagination,
      searchText,
    });

    return {
      data: this.outputAdapter(result),
      total: result.total,
    };

  }
}

type eventTypeDto = {
  uuid: UUID;
  name: string;
  description: string;
}

type Output = {
  data: eventTypeDto[],
  total: number,
};
