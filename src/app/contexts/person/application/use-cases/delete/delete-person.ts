import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { PersonRepository } from 'person/infrastructure/person.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeletePerson extends UseCase {
  constructor(
    @Inject(PersonRepository)
    protected repository: PersonRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const personDb = await this.repository.findOneByUuid(uuid);

    if (!personDb) throw new NotFoundException('person not found');

    await this.repository.delete(uuid);

  }
}
