import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';

interface executeCommand {
  uuid: UUID;
  name: string,
  description?: string,
}

@Injectable()
export class UpdateCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository,
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

    const cultivationDB = await this.repository.findOneByUuid(uuid);

    if (!cultivationDB) throw new NotFoundException('cultivation is not found');

    const cultivation = new Cultivation({
      id: cultivationDB.id,
      uuid,
      name,
      description,
    });

    const saved = await this.repository.update(cultivation);

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
