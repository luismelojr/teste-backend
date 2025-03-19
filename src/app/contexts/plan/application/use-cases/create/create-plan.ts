import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { Plan } from 'plan/domain/plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

interface executeCommand {
  name: string,
  description?: string,
  functions?: {
    id?: EntityPrimaryKey;
    uuid?: UUID;
    name: string,
    description?: string,
  }[]
}

@Injectable()
export class CreatePlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { name, description, functions } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }

    const plan = Plan.create(name, description, functions);

    const saved = await this.repository.create(plan);

    return {
      uuid: saved.uuid,
      name: saved.name,
      description: saved.description,
      functions: saved.functions?.map((func) => ({
        uuid: func.uuid,
        name: func.name,
        description: func.description,
      })),
    };
  }
}

type functionsOutput = {
  uuid: UUID;
  name: string;
  description: string;
};

type Output = {
  uuid: UUID;
  name: string;
  description: string;
  functions: functionsOutput[];
};

