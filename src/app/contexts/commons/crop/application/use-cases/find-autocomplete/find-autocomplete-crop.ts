import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteCrop extends UseCase{
  constructor(
    @Inject(CropRepository)
    protected repository: CropRepository
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
