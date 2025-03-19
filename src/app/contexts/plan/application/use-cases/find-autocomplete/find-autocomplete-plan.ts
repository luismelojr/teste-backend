import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { PlanRepository } from 'plan/infrastructure/plan.repository';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompletePlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
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
