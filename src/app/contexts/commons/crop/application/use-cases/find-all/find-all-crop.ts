import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import {
  PaginationOutput
} from 'shared/abstracts/paginations/pagination.output';
import { Crop } from 'commons/crop/domain/crop';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllCrop extends UseCase {
  constructor(
    @Inject(CropRepository)
    protected respository: CropRepository
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Output> {
    const {pagination, searchText} = command

    const result = await this.respository.findAll({pagination, searchText})

    return {
      data: this.outputAdapter(result),
      total: result.total
    }
  }

  outputAdapter(result: PaginationOutput<Crop>): ReturnCrop[] {
    return result.data.map((item) => {
      return {
        uuid: item.uuid,
        name: item.name,
        type: item.type,
        start: item.start,
        end: item.end
      }
    })
  }
}

type ReturnCrop = {
  uuid: UUID,
  name: string,
  type: CropTypeEnum,
  start: number;
  end: number;
}

type Output = {
  data: ReturnCrop[]
  total: number
}
