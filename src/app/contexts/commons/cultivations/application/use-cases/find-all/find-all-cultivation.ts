import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllCultivation extends UseCase {
  constructor(
    @Inject(CultivationRepository)
    protected repository: CultivationRepository,
  ) {
    super();
  }

  outputAdapter(result): cultivationDTO[] {
    return result.data.map((cultivation: Cultivation) => {
      return {
        uuid: cultivation.uuid,
        name: cultivation.name,
        description: cultivation.description,
      };
    });
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { pagination, searchText } = command;

    const result = await this.repository.findAll({
      pagination,
      searchText,
    });

    return {
      data: this.outputAdapter(result),
      total: result.total,
    };

  }
}

type cultivationDTO = {
  uuid: UUID;
  name: string;
  description: string;
}

type Output = {
  data: cultivationDTO[],
  total: number,
};
