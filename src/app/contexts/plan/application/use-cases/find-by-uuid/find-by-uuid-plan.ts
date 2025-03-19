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
export class FindByUuidPlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const plan = await this.repository.findOneByUuid(uuid);

    if (!plan) throw new NotFoundException('plan is not found');

    return {
      uuid: plan.uuid,
      name: plan.name,
      description: plan.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
