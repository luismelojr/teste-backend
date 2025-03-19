import { Contract } from 'contract/domain/contract';
import { ContractEntity } from '../entities/contract.entity';

export class ToEntityAdapter {
  static execute(domain: Contract): ContractEntity {
    const entity = new ContractEntity();
    entity.id = domain.id;
    entity.uuid = domain.uuid;
    entity.identifier = domain.identifier;
    entity.description = domain.description;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;

    if (domain.plan) {
      entity.plan = {
        id: domain.plan.id,
        uuid: domain.plan.uuid,
      } as any;
    }

    if (domain.company) {
      entity.company = {
        id: domain.company.id,
        uuid: domain.company.uuid,
      } as any;
    }

    if (domain.person) {
      entity.person = {
        id: domain.person.id,
        uuid: domain.person.uuid,
      } as any;
    }

    if (domain.customerId) {
      entity.customer = {
        id: domain.customerId,
      } as any;
    }

    return entity;
  }
}
