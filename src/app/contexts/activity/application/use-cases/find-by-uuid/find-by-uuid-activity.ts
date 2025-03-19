import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const activity = await this.repository.findOneByUuid(uuid);

    if (!activity) throw new NotFoundException('activity is not found');

    return {
      uuid: activity.uuid,
      name: activity.name,
      description: activity.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
