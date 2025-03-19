import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { CityService } from 'commons/locations/city/application/city.service';
import { Company } from 'company/domain/company';
import { CompanyRepository } from 'company/infrastructure/company.repository';

interface executeCommand {
  name: string,
  cnpj: string,
  tradeName?: string,
  phone?: string,
  city?: { uuid: string };
  address?: string,
  email?: string,
}

@Injectable()
export class CreateCompany extends UseCase {
  constructor(
    @Inject(CompanyRepository)
    protected repository: CompanyRepository,
    protected cityService: CityService,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { name, cnpj, tradeName, phone, city, address, email } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }
    if (!cnpj) {
      throw new BadRequestException('cnpj is required');
    }

    let cityToSave = undefined;

    if (city) {
      cityToSave = await this.cityService.findOneByUuid(city.uuid);
    }

    const company = Company.create(name, tradeName, cnpj, phone, cityToSave, address, email);

    const saved = await this.repository.create(company);

    return {
      uuid: saved.uuid,
      name: saved.name?.getValue(),
      cnpj: saved.cnpj?.getValue(),
      tradeName: saved.tradeName?.getValue(),
      phone: saved.phone?.getValue(),
      city: cityToSave ? {
        uuid: city?.uuid,
      } : undefined,
      address: saved.address,
      email: saved.email?.getValue(),
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
