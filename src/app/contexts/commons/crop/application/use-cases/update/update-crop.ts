import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Crop } from 'commons/crop/domain/crop';
import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropFactory } from 'commons/crop/domain/factories/crop.factory';

interface executeCommand {
  uuid: UUID;
  type: CropTypeEnum;
  start?: number;
  end?: number;
}

@Injectable()
export class UpdateCrop extends UseCase {
  constructor(
    @Inject(CropRepository)
    protected repository: CropRepository,
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Crop> {
    const { uuid, type, start, end } = command;
    const cropDb = await this.repository.findOneByUuid(uuid);

    if (!cropDb) {
      throw new NotFoundException('Crop not found');
    }

    const crop = CropFactory.create({type, start, end });

    return await this.repository.update(crop);
  }
}
