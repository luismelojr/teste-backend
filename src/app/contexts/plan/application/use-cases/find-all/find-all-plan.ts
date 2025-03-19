import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { PlanRepository } from 'plan/infrastructure/plan.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllPlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
  ) {
    super();
  }

  outputAdapter(result): planDto[] {
    return result.data.map((plan) => {
      return {
        uuid: plan.uuid,
        name: plan.name,
        description: plan.description,
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

type planDto = {
  uuid: UUID;
  name: string;
  description: string;
}

type Output = {
  data: planDto[],
  total: number,
};
