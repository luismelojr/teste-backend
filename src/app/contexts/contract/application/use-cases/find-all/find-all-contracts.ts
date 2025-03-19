import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { FindAllContractsOutput } from './find-all-contracts-output.type';
import { FindAllContractsOutputAdapter } from './find-all-contracts-output.adapter';

export interface FindAllContractsCommand {
  pagination: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllContracts extends UseCase {
  constructor(
    @Inject(ContractRepository)
    protected contractRepository: ContractRepository,
  ) {
    super();
  }

  async execute(
    command: FindAllContractsCommand,
  ): Promise<FindAllContractsOutput> {
    const { pagination, searchText } = command;

    const result = await this.contractRepository.findAll({
      pagination,
      searchText,
    });

    return FindAllContractsOutputAdapter.execute(result);
  }
}
