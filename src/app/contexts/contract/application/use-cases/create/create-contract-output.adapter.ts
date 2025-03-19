import { Contract } from 'contract/domain/contract';
import { CreateContractOutput } from './create-contract-output.type';

export class CreateContractOutputAdapter {
  static execute(contractSaved: Contract): CreateContractOutput {
    return {
      id: contractSaved.id,
      uuid: contractSaved.uuid,
      identifier: contractSaved.identifier,
      description: contractSaved.description,
      startDate: contractSaved.startDate,
      endDate: contractSaved.endDate,
      plan: {
        id: contractSaved.plan.id,
        uuid: contractSaved.plan.uuid,
        name: contractSaved.plan.name,
        description: contractSaved.plan.description,
      },
      company: contractSaved.company ? {
        id: contractSaved.company.id,
        uuid: contractSaved.company.uuid,
        name: contractSaved.company.name,
        cnpj: contractSaved.company.cnpj,
      } : undefined,
      person: contractSaved.person ? {
        id: contractSaved.person.id,
        uuid: contractSaved.person.uuid,
        name: contractSaved.person.name,
        cpf: contractSaved.person.cpf,
      } : undefined,
      customerId: contractSaved.customerId,
      isActive: contractSaved.isActive,
      duration: contractSaved.duration,
    };
  }
}
