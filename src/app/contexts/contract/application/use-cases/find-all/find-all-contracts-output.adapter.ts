import { PaginationOutput } from 'shared/abstracts/paginations/pagination.output';
import { Contract } from 'contract/domain/contract';
import { FindAllContractsOutput } from './find-all-contracts-output.type';

export class FindAllContractsOutputAdapter {
  static execute(result: PaginationOutput<Contract>): FindAllContractsOutput {
    return {
      data: result.data.map((contract) => ({
        id: contract.id,
        uuid: contract.uuid,
        identifier: contract.identifier,
        description: contract.description,
        startDate: contract.startDate,
        endDate: contract.endDate,
        isActive: contract.isActive,
        plan: {
          id: contract.plan.id,
          uuid: contract.plan.uuid,
          name: contract.plan.name,
        },
        company: contract.company
          ? {
              id: contract.company.id,
              uuid: contract.company.uuid,
              name: contract.company.name,
            }
          : undefined,
        person: contract.person
          ? {
              id: contract.person.id,
              uuid: contract.person.uuid,
              name: contract.person.name,
            }
          : undefined,
        customerId: contract.customerId,
      })),
      total: result.total,
    };
  }
}
