import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { Plan } from '../domain/plan';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanRepositoryImpl } from 'plan/infrastructure/plan.repository.impl';
import { PlanEntity } from 'plan/infrastructure/entities/plan.entity';
import {
  PlanFunctionEntity,
} from 'plan/infrastructure/entities/plan-function.entity';

export const plan = {
  name: 'Mock name',
  description: 'description test',
};

export const createPlan = {
  name: 'Mock name',
  description: 'description test',
  functions: [
    {
      name: 'Functions Mock name',
      description: 'Functions description test',
    },
  ],
};

describe('PlanRepositoryImpl', () => {
  let repository: PlanRepositoryImpl;
  let mockRepository: Repository<PlanEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createPlan }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createPlan }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...plan }),
      softremove: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...plan },
          { id: '2', ...plan },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${plan.name}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      PlanRepositoryImpl,
      {
        provide: getRepositoryToken(PlanEntity),
        useValue: repositoryMock,
      },
      {
        provide: getRepositoryToken(PlanFunctionEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<PlanRepositoryImpl>(PlanRepositoryImpl);
    mockRepository = module.get<Repository<PlanEntity>>(
      getRepositoryToken(PlanEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new Plan', async () => {
      const result = await repository.create(new Plan(createPlan));
      expect(mockRepository.save).toBeCalledWith(expect.any(PlanEntity));
      expect(result).toBeInstanceOf(Plan);
    });
  });

  describe('update', () => {
    it('should update an existing Plan', async () => {
      const updatedPlan = new Plan({ id: '1', ...createPlan });
      const result = await repository.update(updatedPlan);
      expect(mockRepository.save).toBeCalledWith(expect.any(PlanEntity));
      expect(result).toBeInstanceOf(Plan);
    });
  });

  describe('delete', () => {
    it('should throw an error if Plan not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(repository.delete('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('should return by ID', async () => {
      const result = await repository.findOneById('1');
      expect(mockRepository.findOne).toBeCalledWith({
        relations: ['functions'],
        where: { id: '1' },
      });
      expect(result).toBeInstanceOf(Plan);
    });
  });

  describe('findOneByUuid', () => {
    it('should return by UUID', async () => {
      const result = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        relations: ['functions'],
        where: { uuid: 'uuid' },
      });
      expect(result).toBeInstanceOf(Plan);
    });
  });

  describe('findAll', () => {
    it('should return paginated results without searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const result = await repository.findAll({ pagination });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations: ['functions'],
        where: [],
        order: { updatedAt: 'DESC' },
        take: 10,
        skip: 0,
      });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
    it('should return paginated results with searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const searchText = 'teste';

      const result = await repository.findAll({ pagination, searchText });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations: ['functions'],
        where: [
          { name: ILike(`%${searchText}%`) },
        ],
        order: { updatedAt: 'DESC' },
        take: 10,
        skip: 0,
      });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('findAutocomplete', () => {
    it('should return autocomplete results', async () => {
      const query = 'test';
      const result = await repository.findAutocomplete(query);
      expect(mockRepository.createQueryBuilder).toBeCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: `${plan.name}`,
        uuid: 'uuid',
      });
    });
  });
});
