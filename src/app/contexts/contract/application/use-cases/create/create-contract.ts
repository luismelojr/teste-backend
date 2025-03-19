import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { CustomerRepository } from 'customer/infrastructure/customer.repository';
import { ContractRelationFetch } from 'contract/application/use-cases/contract-relation-fetch';
import { executeCreateContractCommand } from './create-contract.command';
import { CreateContractOutput } from './create-contract-output.type';
import { CreateContractOutputAdapter } from './create-contract-output.adapter';
import { Contract } from 'contract/domain/contract';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateContract extends UseCase {
  constructor(
    @Inject(ContractRepository)
    protected contractRepository: ContractRepository,
    @Inject(CustomerRepository)
    protected customerRepository: CustomerRepository,
    private readonly relationFetcher: ContractRelationFetch,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async execute(
    command: executeCreateContractCommand,
  ): Promise<CreateContractOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { plan, company, person } =
        await this.relationFetcher.fetchRelations(command);

      const contract = Contract.create({
        identifier: command.identifier,
        description: command.description,
        startDate: command.startDate,
        endDate: command.endDate,
        plan,
        company,
        person,
      });

      const savedContract = await this.contractRepository.create(contract);

      const customer = savedContract.createCustomer();

      const savedCustomer = await this.customerRepository.create(customer);

      const updatedContract = savedContract.linkToCustomer(savedCustomer.id);

      const finalContract =
        await this.contractRepository.update(updatedContract);

      await queryRunner.commitTransaction();

      return CreateContractOutputAdapter.execute(finalContract);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
