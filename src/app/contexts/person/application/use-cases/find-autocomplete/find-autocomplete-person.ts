import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompletePerson extends UseCase {
  constructor(
    @Inject(PersonRepository)
    protected repository: PersonRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { query } = command;
    return await this.repository.findAutocomplete(query);
  }
}

type Output = {
  uuid: UUID;
  name: string;
}[];
