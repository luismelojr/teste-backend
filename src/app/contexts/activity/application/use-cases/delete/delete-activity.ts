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
export class DeleteActivity extends UseCase {
  constructor(
    @Inject(ActivityRepository)
    protected repository: ActivityRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const activityDb = await this.repository.findOneByUuid(uuid);

    if (!activityDb) throw new NotFoundException('activity not found');

    await this.repository.delete(uuid);

  }
}
