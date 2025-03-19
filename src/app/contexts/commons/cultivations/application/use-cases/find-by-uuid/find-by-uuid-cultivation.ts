import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const cultivation = await this.repository.findOneByUuid(uuid);

    if (!cultivation) throw new NotFoundException('cultivation is not found');

    return {
      uuid: cultivation.uuid,
      name: cultivation.name,
      description: cultivation.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
