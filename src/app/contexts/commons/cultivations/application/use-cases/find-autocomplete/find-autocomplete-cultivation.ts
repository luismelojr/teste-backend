import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository,
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
