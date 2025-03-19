import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { Plan } from 'plan/domain/plan';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

interface executeCommand {
  uuid: UUID;
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
export class UpdatePlan extends UseCase {
  constructor(
    @Inject(PlanRepository)
    protected repository: PlanRepository,
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
      functions,
    } = command;

    const planDb = await this.repository.findOneByUuid(uuid);

    if (!planDb) throw new NotFoundException('plan is not found');

    const plan = new Plan({
      id: planDb.id,
      uuid,
      name,
      description,
      functions,
    });

    const saved = await this.repository.update(plan);

    const planFunctions = [];

    if (saved.functions) {
      for (const func of saved.functions) {
        let result;

        if (func.uuid) {
          const resultFunction = await this.repository.findFunctionByUuid(func.uuid);
          result = { id: resultFunction.id, ...func };
        } else {
          result = { ...func };
        }

        planFunctions.push(result);
      }
    }


    return {
      uuid: saved.uuid,
      name: saved.name,
      description: saved.description,
      functions: planFunctions,
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

