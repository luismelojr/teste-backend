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
export class FindByUuidCompany extends UseCase {
  constructor(
    @Inject(CompanyRepository)
    protected repository: CompanyRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const company = await this.repository.findOneByUuid(uuid);

    if (!company) throw new NotFoundException('company is not found');

    return {
      uuid: company.uuid,
      name: company.name?.getValue(),
      cnpj: company.cnpj?.getValue(),
      tradeName: company.tradeName?.getValue(),
      phone: company.phone?.getValue(),
      city: company ? {
        uuid: company?.uuid,
      } : undefined,
      address: company.address,
      email: company.email?.getValue(),
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  city: {
    uuid: UUID,
  };
  address: string;
  email: string;
};
