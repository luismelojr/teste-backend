import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  uuid: UUID
}

@Injectable()
export class DeleteCrop extends UseCase {
  constructor(
    @Inject(CropRepository)
    protected repository: CropRepository
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<void> {
    const { uuid } = command;

    if (!uuid) {
      throw new BadRequestException('UUID is required');
    }

    const crop = await this.repository.findOneByUuid(uuid);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    await this.repository.delete(crop.uuid);
  }
}
