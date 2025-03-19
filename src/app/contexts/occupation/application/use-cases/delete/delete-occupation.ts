import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteOccupation extends UseCase {
  constructor(
    @Inject(OccupationRepository)
    protected repository: OccupationRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const occupationDb = await this.repository.findOneByUuid(uuid);

    if (!occupationDb) throw new NotFoundException('Occupation not found');

    await this.repository.delete(uuid);

  }
}
