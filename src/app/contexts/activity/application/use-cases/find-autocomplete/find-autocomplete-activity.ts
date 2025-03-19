import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
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
