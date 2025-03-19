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
export class FindByUuidOccupation extends UseCase {
  constructor(
    @Inject(OccupationRepository)
    protected repository: OccupationRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const occupation = await this.repository.findOneByUuid(uuid);

    if (!occupation) throw new NotFoundException('Occupation is not found');

    return {
      uuid: occupation.uuid,
      name: occupation.name,
      description: occupation.description,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  description: string;
};
