import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CONTRACT_RELATIONS,
  ContractRepositoryImpl,
} from 'contract/infrastructure/contract.repository.impl';
import { ContractEntity } from 'contract/infrastructure/entities/contract.entity';
import { ToEntityAdapter } from 'contract/infrastructure/adapters/to-entity.adapter';
import { Contract } from 'contract/domain/contract';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { ToDomainAdapter } from 'contract/infrastructure/adapters/to-domain.adapter';
import { ContractTransaction } from 'contract/infrastructure/contract.transaction';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { PaginationOutput } from 'shared/abstracts/paginations/pagination.output';
import { contract, plan, company } from './contract-mock';

describe('ContractRepositoryImpl', () => {
  let repository: ContractRepositoryImpl;
  let mockRepository: Repository<ContractEntity>;
  let dataSource: DataSource;
  let repositoryMock;
  let dataSourceMock;
  let queryRunner;

  const expectedRaw = { name: 'CT-001', uuid: generateUuidV4() };

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      softRemove: jest.fn(),
      findAndCount: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          expectedRaw,
        ]),
      })),
    };

    dataSourceMock = {
      createQueryRunner: jest.fn(),
    };

    const infrastructure: Provider[] = [
      ContractRepositoryImpl,
      {
        provide: getRepositoryToken(ContractEntity),
        useValue: repositoryMock,
      },
      {
        provide: DataSource,
        useValue: dataSourceMock,
      },
      ToDomainAdapter,
      ToEntityAdapter,
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    repository = module.get<ContractRepositoryImpl>(ContractRepositoryImpl);
    mockRepository = module.get<Repository<ContractEntity>>(
      getRepositoryToken(ContractEntity),
    );

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        softRemove: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          relation: jest.fn().mockReturnThis(),
          of: jest.fn().mockReturnThis(),
          remove: jest.fn().mockResolvedValue(undefined),
        }),
      },
    } as unknown as QueryRunner;

    jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(queryRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a Contract successfully', async () => {
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: contract.identifier,
        description: contract.description,
        startDate: contract.startDate,
        endDate: contract.endDate,
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);

      const fullEntityContract = {
        ...entityContract,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.save.mockResolvedValue(entityContract);
      repositoryMock.findOne.mockResolvedValue(fullEntityContract);

      jest.spyOn(repository, 'findOneById');
      jest.spyOn(ToEntityAdapter, 'execute');
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.create(domainContract);

      expect(ToEntityAdapter.execute).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(entityContract);
      expect(repository.findOneById).toHaveBeenCalledWith(entityContract.id);

      expect(result.id).toEqual(domainContract.id);
      expect(result.identifier).toEqual(domainContract.identifier);
      expect(result.description).toEqual(domainContract.description);
      expect(result.startDate).toEqual(domainContract.startDate);
      expect(result.endDate).toEqual(domainContract.endDate);
      expect(result.plan.id).toEqual(plan.id);
      expect(result.plan.name).toEqual(plan.name);
      expect(result.company.id).toEqual(company.id);
      expect(result.company.name).toEqual(company.name);
    });

    it('should throw an error if save fails', async () => {
      const domainContract = new Contract({
        id: '3',
        uuid: generateUuidV4(),
        identifier: 'CT-003',
        description: 'Teste erro',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);

      jest.spyOn(ToEntityAdapter, 'execute');
      repositoryMock.save.mockRejectedValue(new Error('Mock Database error'));

      await expect(repository.create(domainContract)).rejects.toThrow('Mock Database error');
      expect(ToEntityAdapter.execute).toHaveBeenCalledWith(domainContract);
      expect(mockRepository.save).toHaveBeenCalledWith(entityContract);
    });
  });

  describe('update', () => {
    it('should update a Contract successfully', async () => {
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato atualizado',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);

      const fullEntityContract = {
        ...entityContract,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.findOne.mockResolvedValue(fullEntityContract);
      queryRunner.manager.save.mockResolvedValue(fullEntityContract);

      jest.spyOn(ToEntityAdapter, 'execute');
      jest.spyOn(ContractTransaction, 'saveContractToUpdate');
      jest.spyOn(repository, 'findOneById');

      repositoryMock.findOne.mockImplementation((options) => {
        if (options?.where?.id === '1') {
          return Promise.resolve(fullEntityContract);
        }
        return Promise.resolve(fullEntityContract);
      });

      const result = await repository.update(domainContract);

      expect(ToEntityAdapter.execute).toHaveBeenCalledWith(domainContract);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: domainContract.uuid },
        relations: CONTRACT_RELATIONS,
      });
      expect(ContractTransaction.saveContractToUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        queryRunner
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(repository.findOneById).toHaveBeenCalledWith(entityContract.id);

      expect(result.id).toEqual(domainContract.id);
      expect(result.identifier).toEqual(domainContract.identifier);
      expect(result.description).toEqual(domainContract.description);
    });

    it('should throw an error when updating a non-existent Contract', async () => {
      const domainContract = new Contract({
        id: '2',
        uuid: generateUuidV4(),
        identifier: 'CT-002',
        description: 'Tentativa de atualização',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      repositoryMock.findOne.mockResolvedValue(null);

      await expect(repository.update(domainContract)).rejects.toThrow('Contrato não encontrado');

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: domainContract.uuid },
        relations: CONTRACT_RELATIONS,
      });

      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction if an error occurs', async () => {
      const domainContract = new Contract({
        id: '3',
        uuid: generateUuidV4(),
        identifier: 'CT-003',
        description: 'Contrato com erro',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);
      const fullEntityContract = {
        ...entityContract,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.findOne.mockResolvedValue(fullEntityContract);

      jest.spyOn(ToEntityAdapter, 'execute');
      jest.spyOn(ContractTransaction, 'saveContractToUpdate').mockRejectedValueOnce(new Error('Transaction error'));

      await expect(repository.update(domainContract)).rejects.toThrow('Transaction error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should start and end a transaction on update', async () => {
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato atualizado',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      repositoryMock.findOne.mockResolvedValue(ToEntityAdapter.execute(domainContract));
      queryRunner.manager.save.mockResolvedValue(domainContract);

      await repository.update(domainContract);

      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a Contract successfully', async () => {
      const existingContract = new ContractEntity();
      existingContract.id = '1';
      existingContract.uuid = generateUuidV4();

      repositoryMock.findOne.mockResolvedValue(existingContract);
      queryRunner.manager.softRemove.mockResolvedValue(undefined);

      await repository.delete(existingContract.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: existingContract.uuid },
        relations: CONTRACT_RELATIONS,
      });
      expect(queryRunner.manager.softRemove).toHaveBeenCalledWith(existingContract);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw an error when trying to delete a non-existent Contract', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(repository.delete('non-existent-uuid' as UUID)).rejects.toThrow(
        'Contrato não encontrado',
      );

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: 'non-existent-uuid' },
        relations: CONTRACT_RELATIONS,
      });

      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction if an error occurs', async () => {
      const existingContract = new ContractEntity();
      existingContract.id = '2';
      existingContract.uuid = 'rollback-uuid' as UUID;

      repositoryMock.findOne.mockResolvedValue(existingContract);
      queryRunner.manager.softRemove.mockRejectedValue(new Error('Transaction error'));

      await expect(repository.delete(existingContract.uuid)).rejects.toThrow('Transaction error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should mark contract as deleted instead of removing it', async () => {
      const existingContract = new ContractEntity();
      existingContract.id = '1';
      existingContract.uuid = generateUuidV4();

      repositoryMock.findOne.mockResolvedValue(existingContract);
      queryRunner.manager.softRemove.mockResolvedValue(existingContract);

      await repository.delete(existingContract.uuid);

      expect(queryRunner.manager.softRemove).toHaveBeenCalledWith(existingContract);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(existingContract.deletedAt).not.toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return a Contract when found', async () => {
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato existente',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);
      const fullEntityContract = {
        ...entityContract,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.findOne.mockResolvedValue(fullEntityContract);
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.findOneById(domainContract.id);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: entityContract.id },
        relations: CONTRACT_RELATIONS,
      });
      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(fullEntityContract);

      expect(result.id).toEqual(domainContract.id);
      expect(result.identifier).toEqual(domainContract.identifier);
      expect(result.description).toEqual(domainContract.description);
    });

    it('should return undefined when Contract is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.findOneById('999');

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
        relations: CONTRACT_RELATIONS,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('findOneByUuid', () => {
    it('should return a Contract when found', async () => {
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato existente',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const entityContract = ToEntityAdapter.execute(domainContract);
      const fullEntityContract = {
        ...entityContract,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.findOne.mockResolvedValue(fullEntityContract);
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.findOneByUuid(domainContract.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: entityContract.uuid },
        relations: CONTRACT_RELATIONS,
      });
      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(fullEntityContract);

      expect(result.id).toEqual(domainContract.id);
      expect(result.identifier).toEqual(domainContract.identifier);
      expect(result.description).toEqual(domainContract.description);
    });

    it('should return undefined when Contract is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const notExistsUuid = generateUuidV4();

      const result = await repository.findOneByUuid(notExistsUuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: notExistsUuid },
        relations: CONTRACT_RELATIONS,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated Contracts successfully', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      const domainContract1 = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato 1',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const domainContract2 = new Contract({
        id: '2',
        uuid: generateUuidV4(),
        identifier: 'CT-002',
        description: 'Contrato 2',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const contractEntity1 = ToEntityAdapter.execute(domainContract1);
      const contractEntity2 = ToEntityAdapter.execute(domainContract2);

      const fullEntityContract1 = {
        ...contractEntity1,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      const fullEntityContract2 = {
        ...contractEntity2,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        }
      };

      repositoryMock.findAndCount.mockResolvedValue([[fullEntityContract1, fullEntityContract2], 2]);

      jest.spyOn(ToDomainAdapter, 'execute');

      const result: PaginationOutput<Contract> = await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [],
        relations: CONTRACT_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });

      expect(ToDomainAdapter.execute).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].identifier).toEqual(domainContract1.identifier);
      expect(result.data[1].identifier).toEqual(domainContract2.identifier);
    });

    it('should return an empty list when no Contracts exist', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      const result: PaginationOutput<Contract> = await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [],
        relations: CONTRACT_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('should filter Contracts based on searchText', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };
      const searchText = 'CT-001';

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      await repository.findAll({ pagination, searchText });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [
          { identifier: expect.any(Object) },
          { description: expect.any(Object) },
        ],
        relations: CONTRACT_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });
    });

    it('should apply correct pagination parameters', async () => {
      const pagination: PaginationInput = { page: 2, maxPageSize: 5 };

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          skip: 5,
        })
      );
    });
  });

  describe('findAutocomplete', () => {
    it('should return autocomplete results', async () => {
      const query = 'CT-';
      const result = await repository.findAutocomplete(query);
      expect(mockRepository.createQueryBuilder).toBeCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expectedRaw);
    });
  });

  describe('findByCustomerId', () => {
    it('should return contracts for a specific customer', async () => {
      const customerId = '123';
      const domainContract = new Contract({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CT-001',
        description: 'Contrato do cliente',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
        customerId: customerId,
      });

      const contractEntity = ToEntityAdapter.execute(domainContract);
      const fullEntityContract = {
        ...contractEntity,
        plan: {
          id: plan.id,
          uuid: plan.uuid,
          name: plan.name,
          description: plan.description
        },
        company: {
          id: company.id,
          uuid: company.uuid,
          name: company.name,
          cnpj: company.cnpj
        },
        customer: {
          id: customerId
        }
      };

      repositoryMock.find.mockResolvedValue([fullEntityContract]);
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.findByCustomerId(customerId);

      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { customer: { id: customerId } },
        relations: CONTRACT_RELATIONS,
      });

      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(fullEntityContract);
      expect(result).toHaveLength(1);
      expect(result[0].identifier).toEqual(domainContract.identifier);
      expect(result[0].customerId).toEqual(customerId);
    });

    it('should return empty array when no contracts found for customer', async () => {
      const customerId = '456';

      repositoryMock.find.mockResolvedValue([]);

      const result = await repository.findByCustomerId(customerId);

      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { customer: { id: customerId } },
        relations: CONTRACT_RELATIONS,
      });

      expect(result).toEqual([]);
    });
  });
});
