// Path: contract/infrastructure/contract.repository.impl.ts
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, QueryRunner, Repository } from 'typeorm';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { ContractEntity } from './entities/contract.entity';
import { ContractRepository } from './contract.repository';
import { Contract } from 'contract/domain/contract';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import { ToEntityAdapter } from './adapters/to-entity.adapter';
import { ToDomainAdapter } from './adapters/to-domain.adapter';
import { ContractTransaction } from './contract.transaction';

export const CONTRACT_RELATIONS = [
  'plan',
  'company',
  'person',
  'customer',
];

export class ContractRepositoryImpl implements ContractRepository {

  constructor(
    @InjectRepository(ContractEntity)
    private readonly repository: Repository<ContractEntity>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(contract: Contract): Promise<Contract> {
    const entity = ToEntityAdapter.execute(contract);
    const saved = await this.repository.save(entity);
    return this.findOneById(saved.id);
  }

  async update(contract: Contract): Promise<Contract> {
    const entity = ToEntityAdapter.execute(contract);

    const existingContract = await this.repository.findOne({
      where: { uuid: contract.uuid },
      relations: CONTRACT_RELATIONS,
    });

    if (!existingContract) {
      throw new Error('Contrato não encontrado');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saved = await ContractTransaction.saveContractToUpdate(entity, existingContract, queryRunner);

      await queryRunner.commitTransaction();
      return this.findOneById(saved.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(uuid: UUID): Promise<void> {
    const existingContract = await this.repository.findOne({
      where: { uuid },
      relations: CONTRACT_RELATIONS,
    });

    if (!existingContract) {
      throw new Error('Contrato não encontrado');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softRemove(existingContract);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: EntityPrimaryKey): Promise<Contract> {
    const where: any = { id };
    const relations = CONTRACT_RELATIONS;
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? ToDomainAdapter.execute(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Contract> {
    const where: any = { uuid };
    const relations = CONTRACT_RELATIONS;
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? ToDomainAdapter.execute(result) : undefined;
  }

  async findAll({
                  pagination,
                  searchText,
                }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Contract>> {
    const conditions: any = [];
    const relations = CONTRACT_RELATIONS;

    if (searchText) {
      conditions.push({ identifier: ILike(`%${searchText}%`) });
      conditions.push({ description: ILike(`%${searchText}%`) });
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      relations: relations,
      order: { updatedAt: 'DESC' },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = results.map((raw) => ToDomainAdapter.execute(raw));

    return { data, total };
  }

  async findAutocomplete(query: string): Promise<any[]> {
    const limit = 10;

    return await this.repository
      .createQueryBuilder('contract')
      .select(['contract.identifier as name', 'contract.uuid as uuid'])
      .where('contract.identifier ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  async findByCustomerId(customerId: EntityPrimaryKey): Promise<Contract[]> {
    const where: any = { customer: { id: customerId } };
    const relations = CONTRACT_RELATIONS;

    const results = await this.repository.find({
      where,
      relations,
    });

    return results.map(entity => ToDomainAdapter.execute(entity));
  }
}
