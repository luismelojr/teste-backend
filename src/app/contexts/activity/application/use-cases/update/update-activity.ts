import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';

interface executeCommand {
  uuid: UUID;
  name: string,
  description?: string,
}

@Injectable()
export class UpdateActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
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

    const activityDb = await this.repository.findOneByUuid(uuid);

    if (!activityDb) throw new NotFoundException('activity is not found');

    const activity = new Activity({
      id: activityDb.id,
      uuid,
      name,
      description,
    });

    const saved = await this.repository.update(activity);

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
