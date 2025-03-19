import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { PlanRepository } from 'plan/infrastructure/plan.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeletePlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const planDb = await this.repository.findOneByUuid(uuid);

    if (!planDb) throw new NotFoundException('plan not found');

    await this.repository.delete(uuid);

  }
}
