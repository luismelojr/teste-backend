import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  name: string;
  description?: string;
}

@Injectable()
export class CreateCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository
  ) {
    super();
  }

  async execute (command: executeCommand) : Promise<Output> {
    const { name, description } = command;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const cultivation = Cultivation.create(name, description)

    const saved = await this.repository.create(cultivation);

    return {
      uuid: saved.uuid,
      name: saved.name,
      description: saved.description
    }
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description?: string;
}
