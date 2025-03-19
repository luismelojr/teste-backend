import { Contract } from 'contract/domain/contract';
import { ContractEntity } from '../entities/contract.entity';

export class ToDomainAdapter {
  static execute(entity: ContractEntity): Contract {
    const props: any = {
      id: entity.id,
      uuid: entity.uuid,
      identifier: entity.identifier,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };

    if (entity.plan) {
      props.plan = {
        id: entity.plan.id,
        uuid: entity.plan.uuid,
        name: entity.plan.name,
        description: entity.plan.description,
      };
    }

    if (entity.company) {
      props.company = {
        id: entity.company.id,
        uuid: entity.company.uuid,
        name: entity.company.name,
        cnpj: entity.company.cnpj
      };
    }

    if (entity.person) {
      props.person = {
        id: entity.person.id,
        uuid: entity.person.uuid,
        name: entity.person.name,
        cpf: entity.person.cpf
      };
    }

    if (entity.customer) {
      props.customerId = entity.customer.id;
    }

    return new Contract(props);
  }
}
