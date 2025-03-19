import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { UUID } from 'shared/types/uuid';
import { CropType } from 'commons/crop/@types/CropType';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidCrop extends UseCase{
  constructor(
    @Inject(CropRepository)
    protected repository: CropRepository
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Output> {
    const {uuid} = command

    if (!uuid) throw new BadRequestException('uuid is required');

    const crop = await this.repository.findOneByUuid(uuid)

    if (!crop) throw new NotFoundException('crop is not found');

    return {
      uuid: crop.uuid,
      name: crop.name,
      type: crop.type,
    }
  }
}

type Output = {
  uuid: UUID;
  name: string;
  type: CropTypeEnum
}
