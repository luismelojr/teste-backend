import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { CityService } from 'commons/locations/city/application/city.service';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { Company } from 'company/domain/company';

interface executeCommand {
  uuid: UUID;
  name: string,
  cnpj: string,
  tradeName?: string,
  phone?: string,
  city?: { uuid: string };
  address?: string,
  email?: string,
}

@Injectable()
export class UpdateCompany extends UseCase {
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
    const {
      uuid,
      name,
      cnpj,
      tradeName,
      phone,
      city,
      address,
      email,
    } = command;

    const companyDb = await this.repository.findOneByUuid(uuid);

    if (!companyDb) throw new NotFoundException('company is not found');

    let cityId = companyDb.city?.getId() || undefined;

    if (city?.uuid) {
      const cityDb = await this.cityService.findOneByUuid(city.uuid);
      cityId = cityDb?.id;
    }

    const company = new Company({
      id: companyDb.id,
      uuid,
      name,
      tradeName,
      cnpj,
      phone,
      city: { id: cityId },
      address,
      email,
    });

    const saved = await this.repository.update(company);

    return {
      uuid: saved.uuid,
      name: saved.name?.getValue(),
      cnpj: saved.cnpj?.getValue(),
      tradeName: saved.tradeName?.getValue(),
      phone: saved.phone?.getValue(),
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
  address: string;
  email: string;
};
