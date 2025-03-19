import { Contract } from 'contract/domain/contract';
import { Output } from 'contract/application/use-cases/find-by-uuid/find-by-uuid-contract-output.type';

export class FindByUuidContractOutputAdapter {
  static execute(contract: Contract): Output {
    return {
      id: contract.id,
      uuid: contract.uuid,
      identifier: contract.identifier,
      description: contract.description,
      startDate: contract.startDate,
      endDate: contract.endDate,
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
    };
  }
}
