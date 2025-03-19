import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { Occupation } from '../../../domain/occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';

interface executeCommand {
  name: string,
  description?: string;
}

@Injectable()
export class CreateOccupation extends UseCase {
  constructor(
    @Inject(OccupationRepository)
    protected repository: OccupationRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { name, description } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }

    const occupation = Occupation.create(name, description);

    const saved = await this.repository.create(occupation);

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
