import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllOccupation extends UseCase {
  constructor(
    @Inject(OccupationRepository)
    protected repository: OccupationRepository,
  ) {
    super();
  }

  outputAdapter(result): occupationDto[] {
    return result.data.map((occupation) => {
      return {
        uuid: occupation.uuid,
        name: occupation.name,
        description: occupation.description,
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

type occupationDto = {
  uuid: UUID;
  name: string;
  description: string;
}

type Output = {
  data: occupationDto[],
  total: number,
};
