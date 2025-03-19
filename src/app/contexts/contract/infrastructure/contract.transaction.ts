import { QueryRunner } from 'typeorm';
import { ContractEntity } from './entities/contract.entity';

export class ContractTransaction {
  static async saveContractToUpdate(entity: ContractEntity, existingContract: ContractEntity, queryRunner: QueryRunner): Promise<ContractEntity> {
    existingContract.identifier = entity.identifier;
    existingContract.description = entity.description;
    existingContract.startDate = entity.startDate;
    existingContract.endDate = entity.endDate;
    existingContract.plan = entity.plan;
    existingContract.company = entity.company;
    existingContract.person = entity.person;
    existingContract.customer = entity.customer;

    return queryRunner.manager.save(existingContract);
  }
}
