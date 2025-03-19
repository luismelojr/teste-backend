import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { Activity } from 'activity/domain/activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';

interface executeCommand {
  name: string,
  description?: string,
}

@Injectable()
export class CreateActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { name, description } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }

    const activity = Activity.create(name, description);

    const saved = await this.repository.create(activity);

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
