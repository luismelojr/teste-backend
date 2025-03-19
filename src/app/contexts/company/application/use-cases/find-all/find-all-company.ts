import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { CompanyRepository } from 'company/infrastructure/company.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllCompany extends UseCase {
  constructor(
    @Inject(CompanyRepository)
    protected repository: CompanyRepository,
  ) {
    super();
  }

  outputAdapter(result): companyDto[] {
    return result.data.map((company) => {
      return {
        uuid: company.uuid,
        name: company.name?.getValue(),
        cnpj: company.cnpj?.getValue(),
        tradeName: company.tradeName?.getValue(),
        phone: company.phone?.getValue(),
        city: company.city ? {
          uuid: company.city?.uuid,
          name: company.city?.name,
        } : undefined,
        address: company.address,
        email: company.email?.getValue(),
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

type companyDto = {
  uuid: UUID;
  name: string;
  tradeName: string,
  cnpj: string,
  phone: string;
  city: {
    uuid: UUID,
    name: string;
  };
  address: string;
  email?: string,
}

type Output = {
  data: companyDto[],
  total: number,
};
