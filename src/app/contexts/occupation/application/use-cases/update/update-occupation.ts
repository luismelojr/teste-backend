import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';

interface executeCommand {
  uuid: UUID;
  name: string,
  description?: string,
}

@Injectable()
export class UpdateOccupation extends UseCase {
  constructor(
    @Inject(OccupationRepository)
    protected repository: OccupationRepository,
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
    } = command;

    const occupationDb = await this.repository.findOneByUuid(uuid);

    if (!occupationDb) throw new NotFoundException('occupation is not found');

    const occupation = new Occupation({
      id: occupationDb.id,
      uuid,
      name,
      description,
    });

    const saved = await this.repository.update(occupation);

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
