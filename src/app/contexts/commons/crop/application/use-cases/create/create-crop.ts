import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Crop } from 'commons/crop/domain/crop';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropFactory } from 'commons/crop/domain/factories/crop.factory';

interface executeCommand {
  type: CropTypeEnum;
  start?: number;
  end?: number;
}

@Injectable()
export class CreateCrop extends UseCase {
  constructor(
    @Inject(CropRepository)
    protected repository: CropRepository,
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Crop> {
    const { type, start, end } = command;

    if (!type) {
      throw new BadRequestException('type is required');
    }

  const crop = CropFactory.create({ type, start, end });

    return await this.repository.create(crop);
  }
}
