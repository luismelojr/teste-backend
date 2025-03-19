import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { UUID } from 'shared/types/uuid';
import { DataSource } from 'typeorm';

@Injectable()
export class DeleteContract extends UseCase {
  constructor(
    @Inject(ContractRepository)
    protected contractRepository: ContractRepository,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async execute(uuid: UUID): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const contract = await this.contractRepository.findOneByUuid(uuid);
      if (!contract) {
        throw new Error('Contract not found');
      }

      await this.contractRepository.delete(uuid);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
