import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { UserRepository } from 'user/infrastructure/user.repository';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
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
