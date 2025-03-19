import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { CompanyRepository } from 'company/infrastructure/company.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteCompany extends UseCase {
  constructor(
    @Inject(CompanyRepository)
    protected repository: CompanyRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const companyDb = await this.repository.findOneByUuid(uuid);

    if (!companyDb) throw new NotFoundException('company not found');

    await this.repository.delete(uuid);

  }
}
