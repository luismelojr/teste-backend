import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CUSTOMER_RELATIONS,
  CustomerRepositoryImpl,
} from 'customer/infrastructure/customer.repository.impl';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  ToEntityAdapter,
} from 'customer/infrastructure/adapters/to-entity.adapter';
import { Customer } from 'customer/domain/customer';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  ToDomainAdapter,
} from 'customer/infrastructure/adapters/to-domain.adapter';
import {
  CustomerTransaction,
} from 'customer/infrastructure/customer.transaction';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import {
  CustomerCropInformationCultivationEntity,
} from 'customer/infrastructure/entities/customer-crop-information-cultivation.entity';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

describe('CustomerRepositoryImpl', () => {
  let repository: CustomerRepositoryImpl;
  let mockRepository: Repository<CustomerEntity>;
  let dataSource: DataSource;
  let repositoryMock;
  let dataSourceMock;
  let queryRunner;

  const expectedRaw = { name: 'CUSTOMER-001', uuid: generateUuidV4() };

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
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
      CustomerRepositoryImpl,
      {
        provide: getRepositoryToken(CustomerEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(CustomerActivityEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(CustomerCropEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(CustomerPersonEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(CustomerCropInformationEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(CustomerCropInformationCultivationEntity),
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
    repository = module.get<CustomerRepositoryImpl>(CustomerRepositoryImpl);
    mockRepository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity),
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
    it('should create a Customer successfully', async () => {
      const domainCustomer = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CUST-001',
        groupIdentifier: 'GROUP-001',
        description: 'Teste de cliente',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: false,
          isReceiveThirdGrains: true,
          annualQuantity: 1000,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const entityCustomer = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.save.mockResolvedValue(entityCustomer);
      repositoryMock.findOne.mockResolvedValue(entityCustomer);

      jest.spyOn(repository, 'findOneById');
      jest.spyOn(ToEntityAdapter, 'execute');

      const result = await repository.create(domainCustomer);

      expect(ToEntityAdapter.execute).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(entityCustomer);
      expect(repository.findOneById).toHaveBeenCalledWith(entityCustomer.id);
      expect(result).toEqual(domainCustomer);
    });

    it('should throw an error if save fails', async () => {
      const domainCustomer = new Customer({
        id: '3',
        uuid: generateUuidV4(),
        identifier: 'CUST-003',
        groupIdentifier: 'GROUP-003',
        description: 'Teste erro',
        financialTools: false,
        receivesLandRent: true,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: true,
          isReceiveThirdGrains: false,
          annualQuantity: 500,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const entityCustomer = ToEntityAdapter.execute(domainCustomer);

      jest.spyOn(ToEntityAdapter, 'execute');
      repositoryMock.save.mockRejectedValue(new Error('Mock Database error'));

      await expect(repository.create(domainCustomer)).rejects.toThrow('Mock Database error');
      expect(ToEntityAdapter.execute).toHaveBeenCalledWith(domainCustomer);
      expect(mockRepository.save).toHaveBeenCalledWith(entityCustomer);
    });

  });

  describe('update', () => {
    it('should update a Customer successfully', async () => {
      const domainCustomer = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CUST-001',
        groupIdentifier: 'GROUP-001',
        description: 'Cliente atualizado',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: false,
          isReceiveThirdGrains: true,
          annualQuantity: 1500,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const entityCustomer = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.findOne.mockResolvedValue(entityCustomer);
      queryRunner.manager.save.mockResolvedValue(entityCustomer);

      jest.spyOn(ToEntityAdapter, 'execute');
      jest.spyOn(CustomerTransaction, 'handleSoftDeletes');
      jest.spyOn(CustomerTransaction, 'saveCustomerToUpdate');
      jest.spyOn(repository, 'findOneById');

      const result = await repository.update(domainCustomer);

      expect(ToEntityAdapter.execute).toHaveBeenCalledWith(domainCustomer);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: domainCustomer.uuid },
        relations: CUSTOMER_RELATIONS,
      });
      expect(CustomerTransaction.handleSoftDeletes).toHaveBeenCalledWith(entityCustomer, entityCustomer, queryRunner);
      expect(CustomerTransaction.saveCustomerToUpdate).toHaveBeenCalledWith(entityCustomer, entityCustomer, queryRunner);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(repository.findOneById).toHaveBeenCalledWith(entityCustomer.id);
      expect(result).toEqual(domainCustomer);
    });

    it('should throw an error when updating a non-existent Customer', async () => {
      const domainCustomer = new Customer({
        id: '2',
        uuid: generateUuidV4(),
        identifier: 'CUST-002',
        groupIdentifier: 'GROUP-002',
        description: 'Tentativa de atualização',
        financialTools: false,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: false,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      repositoryMock.findOne.mockResolvedValue(null);

      await expect(repository.update(domainCustomer)).rejects.toThrow('Customer not found');

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: domainCustomer.uuid },
        relations: CUSTOMER_RELATIONS,
      });

      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction if an error occurs', async () => {
      const domainCustomer = new Customer({
        id: '3',
        uuid: generateUuidV4(),
        identifier: 'CUST-003',
        groupIdentifier: 'GROUP-003',
        description: 'Cliente com erro',
        financialTools: true,
        receivesLandRent: true,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: true,
          isReceiveThirdGrains: false,
          annualQuantity: 500,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const entityCustomer = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.findOne.mockResolvedValue(entityCustomer);

      jest.spyOn(ToEntityAdapter, 'execute');
      jest.spyOn(CustomerTransaction, 'handleSoftDeletes').mockRejectedValueOnce(new Error('Transaction error'));

      await expect(repository.update(domainCustomer)).rejects.toThrow('Transaction error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });

  });

  describe('delete', () => {
    it('should delete a Customer successfully', async () => {
      const existingCustomer = new CustomerEntity();
      existingCustomer.id = '1';
      existingCustomer.uuid = generateUuidV4();
      existingCustomer.crops = [
        { locations: [{ id: '101' }] } as CustomerCropEntity,
      ];
      existingCustomer.locations = [];
      existingCustomer.activities = [];
      existingCustomer.persons = [];
      existingCustomer.cropInformation = [];

      repositoryMock.findOne.mockResolvedValue(existingCustomer);
      queryRunner.manager.softRemove.mockResolvedValue(undefined);

      jest.spyOn(CustomerTransaction, 'handleSoftDeletes');

      await repository.delete(existingCustomer.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: existingCustomer.uuid },
        relations: CUSTOMER_RELATIONS,
      });
      expect(queryRunner.manager.createQueryBuilder).toHaveBeenCalled();
      expect(CustomerTransaction.handleSoftDeletes).toHaveBeenCalledWith(
        existingCustomer,
        existingCustomer,
        queryRunner,
      );
      expect(queryRunner.manager.softRemove).toHaveBeenCalledWith(existingCustomer);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw an error when trying to delete a non-existent Customer', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(repository.delete('non-existent-uuid' as UUID)).rejects.toThrow(
        'Customer not found',
      );

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: 'non-existent-uuid' },
        relations: CUSTOMER_RELATIONS,
      });

      expect(queryRunner.startTransaction).not.toHaveBeenCalled();
    });

    it('should rollback transaction if an error occurs', async () => {
      const existingCustomer = new CustomerEntity();
      existingCustomer.id = '2';
      existingCustomer.uuid = 'rollback-uuid' as UUID;
      existingCustomer.crops = [
        { locations: [{ id: '102' }] } as CustomerCropEntity,
      ];
      existingCustomer.locations = [];
      existingCustomer.activities = [];
      existingCustomer.persons = [];
      existingCustomer.cropInformation = [];

      repositoryMock.findOne.mockResolvedValue(existingCustomer);

      jest.spyOn(CustomerTransaction, 'handleSoftDeletes').mockRejectedValue(new Error('Transaction error'));

      await expect(repository.delete(existingCustomer.uuid)).rejects.toThrow('Transaction error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should remove CustomerCrop ↔ CustomerLocation relations before deleting', async () => {
      const existingCustomer = new CustomerEntity();
      existingCustomer.id = '3';
      existingCustomer.uuid = 'customer-with-crop' as UUID;
      existingCustomer.crops = [
        { id: '201', locations: [{ id: '301' }] } as CustomerCropEntity,
      ];
      existingCustomer.locations = [];
      existingCustomer.activities = [];
      existingCustomer.persons = [];
      existingCustomer.cropInformation = [];

      repositoryMock.findOne.mockResolvedValue(existingCustomer);
      queryRunner.manager.softRemove.mockResolvedValue(undefined);

      jest.spyOn(CustomerTransaction, 'handleSoftDeletes').mockResolvedValue();

      await repository.delete(existingCustomer.uuid);

      expect(queryRunner.manager.createQueryBuilder).toHaveBeenCalledWith();
      expect(queryRunner.manager.createQueryBuilder().relation).toHaveBeenCalledWith(CustomerCropEntity, 'locations');
      expect(queryRunner.manager.createQueryBuilder().of).toHaveBeenCalledWith(existingCustomer.crops[0]);
      expect(queryRunner.manager.createQueryBuilder().remove).toHaveBeenCalledWith(existingCustomer.crops[0].locations);
    });

  });

  describe('findOneById', () => {
    it('should return a Customer when found', async () => {
      const domainCustomer = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CUST-001',
        groupIdentifier: 'GROUP-001',
        description: 'Cliente existente',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: false,
          isReceiveThirdGrains: true,
          annualQuantity: 1000,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const existingCustomerEntity = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.findOne.mockResolvedValue(existingCustomerEntity);
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.findOneById(domainCustomer.id);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: existingCustomerEntity.id },
        relations: CUSTOMER_RELATIONS,
      });
      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(existingCustomerEntity);
      expect(result).toEqual(domainCustomer);
    });

    it('should return undefined when Customer is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.findOneById('999');

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
        relations: CUSTOMER_RELATIONS,
      });
      expect(result).toBeUndefined();
    });

    it('should ensure relations are included in the query', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await repository.findOneById('1');

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: CUSTOMER_RELATIONS,
      });
    });

  });

  describe('findOneByUuid', () => {
    it('should return a Customer when found', async () => {
      const domainCustomer = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: 'CUST-001',
        groupIdentifier: 'GROUP-001',
        description: 'Cliente existente',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: false,
          isReceiveThirdGrains: true,
          annualQuantity: 1000,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const existingCustomerEntity = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.findOne.mockResolvedValue(existingCustomerEntity);
      jest.spyOn(ToDomainAdapter, 'execute');

      const result = await repository.findOneByUuid(domainCustomer.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: existingCustomerEntity.uuid },
        relations: CUSTOMER_RELATIONS,
      });
      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(existingCustomerEntity);
      expect(result).toEqual(domainCustomer);
    });

    it('should return undefined when Customer is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const notExistsUuid = generateUuidV4();

      const result = await repository.findOneByUuid(notExistsUuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: notExistsUuid },
        relations: CUSTOMER_RELATIONS,
      });
      expect(result).toBeUndefined();
    });

    it('should ensure relations are included in the query', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const existsUuid = generateUuidV4();

      await repository.findOneByUuid(existsUuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: existsUuid },
        relations: CUSTOMER_RELATIONS,
      });
    });

  });

  describe('findAll', () => {
    it('should return paginated Customers successfully', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      const domainCustomer1 = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: '001',
        groupIdentifier: 'GROUP-001',
        description: 'Cliente 1',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: {
          isConsumer: true,
          isOwnGrain: false,
          isReceiveThirdGrains: true,
          annualQuantity: 1000,
        },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const domainCustomer2 = new Customer({
        id: '2',
        uuid: generateUuidV4(),
        identifier: '002',
        groupIdentifier: 'GROUP-002',
        description: 'Cliente 2',
        financialTools: false,
        receivesLandRent: false,
        grainConsumer: { isConsumer: false },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const customerEntity1 = ToEntityAdapter.execute(domainCustomer1);
      const customerEntity2 = ToEntityAdapter.execute(domainCustomer2);

      repositoryMock.findAndCount.mockResolvedValue([[customerEntity1, customerEntity2], 2]);

      jest.spyOn(ToDomainAdapter, 'execute');

      const result: PaginationOutput<Customer> = await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [],
        relations: CUSTOMER_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });

      expect(ToDomainAdapter.execute).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        data: [domainCustomer1, domainCustomer2],
        total: 2,
      });
    });

    it('should return an empty list when no Customers exist', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      const result: PaginationOutput<Customer> = await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [],
        relations: CUSTOMER_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('should filter Customers based on searchText', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };
      const searchText = '001';

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      await repository.findAll({ pagination, searchText });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [
          { identifier: expect.any(Object) },
          { groupIdentifier: expect.any(Object) },
        ],
        relations: CUSTOMER_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: pagination.maxPageSize,
        skip: pagination.maxPageSize * (pagination.page - 1),
      });
    });

    it('should ensure pagination parameters are applied correctly', async () => {
      const pagination: PaginationInput = { page: 2, maxPageSize: 5 };

      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      await repository.findAll({ pagination });

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: [],
        relations: CUSTOMER_RELATIONS,
        order: { updatedAt: 'DESC' },
        take: 5,
        skip: 5,
      });
    });

    it('should ensure that ToDomainAdapter.execute() is called for each result', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      const domainCustomer = new Customer({
        id: '1',
        uuid: generateUuidV4(),
        identifier: '001',
        groupIdentifier: 'GROUP-001',
        description: 'Cliente de teste',
        financialTools: true,
        receivesLandRent: false,
        grainConsumer: { isConsumer: true },
        locations: [],
        activities: [],
        persons: [],
        cropInformation: [],
        crops: [],
      });

      const customerEntity = ToEntityAdapter.execute(domainCustomer);

      repositoryMock.findAndCount.mockResolvedValue([[customerEntity], 1]);
      jest.spyOn(ToDomainAdapter, 'execute');

      await repository.findAll({ pagination });
      expect(ToDomainAdapter.execute).toHaveBeenCalledWith(customerEntity);
    });

  });

  describe('findAutocomplete', () => {
    it('should return autocomplete results', async () => {
      const query = 'CUSTOMER';
      const result = await repository.findAutocomplete(query);
      expect(mockRepository.createQueryBuilder).toBeCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expectedRaw);
    });
  });

  describe('findCustomerPersonByUuid', () => {
    it('should return a CustomerPerson when found', async () => {
      const fakePerson = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'John Doe',
      };

      const fakeOccupation = {
        id: '10',
        uuid: generateUuidV4(),
        name: 'Farmer',
      };

      const fakeCustomerPersonEntity = {
        id: '100',
        uuid: generateUuidV4(),
        customer: { id: '1' },
        person: fakePerson,
        occupation: fakeOccupation,
      } as CustomerPersonEntity;

      repositoryMock.findOne.mockResolvedValueOnce(fakeCustomerPersonEntity);

      const result = await repository.findCustomerPersonByUuid(fakeCustomerPersonEntity.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: fakeCustomerPersonEntity.uuid },
        relations: ['customer', 'person', 'occupation'],
      });

      expect(result.id).toEqual(fakeCustomerPersonEntity.id);
      expect(result.uuid).toEqual(fakeCustomerPersonEntity.uuid);
      expect(result.customerId).toEqual(fakeCustomerPersonEntity.customer.id);
      expect(result.person.id).toEqual(fakeCustomerPersonEntity.person.id);
      expect(result.person.uuid).toEqual(fakeCustomerPersonEntity.person.uuid);
      expect(result.person.name).toEqual(fakeCustomerPersonEntity.person.name);
    });

    it('should return null if CustomerPerson is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const result = await repository.findCustomerPersonByUuid(generateUuidV4());
      expect(result).toBeNull();
    });
  });

  describe('findCustomerActivityByUuid', () => {
    it('should return a CustomerActivity when found', async () => {
      const fakeActivity = {
        id: '50',
        uuid: generateUuidV4(),
        name: 'Harvesting',
      };

      const fakeCustomerActivityEntity = {
        id: '200',
        uuid: generateUuidV4(),
        customer: { id: '1' },
        activity: fakeActivity,
      } as CustomerActivityEntity;

      repositoryMock.findOne.mockResolvedValueOnce(fakeCustomerActivityEntity);

      const result = await repository.findCustomerActivityByUuid(fakeCustomerActivityEntity.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: fakeCustomerActivityEntity.uuid },
        relations: ['customer', 'activity'],
      });

      expect(result.id).toEqual(fakeCustomerActivityEntity.id);
      expect(result.uuid).toEqual(fakeCustomerActivityEntity.uuid);
      expect(result.customerId).toEqual(fakeCustomerActivityEntity.customer.id);
      expect(result.activity.id).toEqual(fakeCustomerActivityEntity.activity.id);
      expect(result.activity.uuid).toEqual(fakeCustomerActivityEntity.activity.uuid);
      expect(result.activity.name).toEqual(fakeCustomerActivityEntity.activity.name);
    });

    it('should return null if CustomerActivity is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const result = await repository.findCustomerActivityByUuid(generateUuidV4());
      expect(result).toBeNull();
    });
  });

  describe('findCustomerCropByUuid', () => {
    it('should return a CustomerCrop when found', async () => {
      const fakeCrop = {
        id: '300',
        uuid: generateUuidV4(),
        name: 'Soybean',
        type: CropTypeEnum.SUMMER,
      };

      const fakeCultivation = {
        id: '400',
        uuid: generateUuidV4(),
        name: 'Rotation',
      };

      const fakeCustomerCropEntity = {
        id: '500',
        uuid: generateUuidV4(),
        customer: { id: '1' },
        identification: 'Crop-123',
        status: CropCustomerStatusEnum.PLANTED,
        crop: fakeCrop,
        cultivation: fakeCultivation,
        locations: [],
      } as CustomerCropEntity;

      repositoryMock.findOne.mockResolvedValueOnce(fakeCustomerCropEntity);

      const result = await repository.findCustomerCropByUuid(fakeCustomerCropEntity.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: fakeCustomerCropEntity.uuid },
        relations: ['customer', 'crop', 'locations', 'cultivation'],
      });

      expect(result.id).toEqual(fakeCustomerCropEntity.id);
      expect(result.uuid).toEqual(fakeCustomerCropEntity.uuid);
      expect(result.customerId).toEqual(fakeCustomerCropEntity.customer.id);
      expect(result.identification).toEqual(fakeCustomerCropEntity.identification);
      expect(result.cropStatus).toEqual(fakeCustomerCropEntity.status);
      expect(result.crop.id).toEqual(fakeCustomerCropEntity.crop.id);
      expect(result.crop.uuid).toEqual(fakeCustomerCropEntity.crop.uuid);
      expect(result.crop.name).toEqual(fakeCustomerCropEntity.crop.name);
      expect(result.crop.type).toEqual(fakeCustomerCropEntity.crop.type);
      expect(result.cultivation.id).toEqual(fakeCustomerCropEntity.cultivation.id);
      expect(result.cultivation.uuid).toEqual(fakeCustomerCropEntity.cultivation.uuid);
      expect(result.cultivation.name).toEqual(fakeCustomerCropEntity.cultivation.name);
    });

    it('should return null if CustomerCrop is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const result = await repository.findCustomerCropByUuid(generateUuidV4());
      expect(result).toBeNull();
    });
  });

  describe('findCustomerCropInformationByUuid', () => {
    it('should return a CustomerCropInformation when found', async () => {
      const fakeCultivation = {
        id: '700',
        uuid: generateUuidV4(),
        name: 'Winter Season',
      };

      const fakeCustomerCropInformationEntity = {
        id: '600',
        uuid: generateUuidV4(),
        customer: { id: '1' },
        typeCrop: 'SUMMER',
        cultivations: [
          {
            id: '800',
            uuid: generateUuidV4(),
            cultivation: fakeCultivation,
          },
        ],
      } as CustomerCropInformationEntity;

      repositoryMock.findOne.mockResolvedValueOnce(fakeCustomerCropInformationEntity);

      const result = await repository.findCustomerCropInformationByUuid(fakeCustomerCropInformationEntity.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: fakeCustomerCropInformationEntity.uuid },
        relations: ['customer', 'cultivations', 'cultivations.cultivation'],
      });

      expect(result.id).toEqual(fakeCustomerCropInformationEntity.id);
      expect(result.uuid).toEqual(fakeCustomerCropInformationEntity.uuid);
      expect(result.customerId).toEqual(fakeCustomerCropInformationEntity.customer.id);
      expect(result.typeCrop).toEqual(fakeCustomerCropInformationEntity.typeCrop);

      const customerCultivation = result.cultivations[0];

      expect(customerCultivation.id).toEqual(fakeCustomerCropInformationEntity.cultivations[0].id);
      expect(customerCultivation.uuid).toEqual(fakeCustomerCropInformationEntity.cultivations[0].uuid);
      expect(customerCultivation.cultivation.id).toEqual(fakeCultivation.id);
      expect(customerCultivation.cultivation.uuid).toEqual(fakeCultivation.uuid);
      expect(customerCultivation.cultivation.name).toEqual(fakeCultivation.name);
    });

    it('should return null if CustomerCropInformation is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const result = await repository.findCustomerCropInformationByUuid(generateUuidV4());
      expect(result).toBeNull();
    });
  });

  describe('findCustomerCropInfoCultivationByUuid', () => {
    it('should return a CustomerCropInformationCultivation when found', async () => {
      const fakeCultivation = {
        id: '900',
        uuid: generateUuidV4(),
        name: 'Irrigation',
      };

      const fakeCustomerCropInfoCultivationEntity = {
        id: '1000',
        uuid: generateUuidV4(),
        customerCropInformation: { id: '600' },
        cultivation: fakeCultivation,
      } as CustomerCropInformationCultivationEntity;

      repositoryMock.findOne.mockResolvedValueOnce(fakeCustomerCropInfoCultivationEntity);

      const result = await repository.findCustomerCropInfoCultivationByUuid(fakeCustomerCropInfoCultivationEntity.uuid);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { uuid: fakeCustomerCropInfoCultivationEntity.uuid },
        relations: ['customerCropInformation', 'cultivation'],
      });

      expect(result.id).toEqual(fakeCustomerCropInfoCultivationEntity.id);
      expect(result.uuid).toEqual(fakeCustomerCropInfoCultivationEntity.uuid);
      expect(result.customerCropInformationId).toEqual(fakeCustomerCropInfoCultivationEntity.customerCropInformation.id);
      expect(result.cultivation.id).toEqual(fakeCultivation.id);
      expect(result.cultivation.uuid).toEqual(fakeCultivation.uuid);
      expect(result.cultivation.name).toEqual(fakeCultivation.name);


    });

    it('should return null if CustomerCropInformationCultivation is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      const result = await repository.findCustomerCropInfoCultivationByUuid(generateUuidV4());
      expect(result).toBeNull();
    });
  });

});
