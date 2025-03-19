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
export class DeleteCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const cultivationDB = await this.repository.findOneByUuid(uuid);

    if (!cultivationDB) throw new NotFoundException('cultivation not found');

    await this.repository.delete(uuid);
  }
}
