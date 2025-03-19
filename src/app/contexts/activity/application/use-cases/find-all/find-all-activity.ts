import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
  ) {
    super();
  }

  outputAdapter(result): activityDto[] {
    return result.data.map((activity) => {
      return {
        uuid: activity.uuid,
        name: activity.name,
        description: activity.description,
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

type activityDto = {
  uuid: UUID;
  name: string;
  description: string;
}

type Output = {
  data: activityDto[],
  total: number,
};
