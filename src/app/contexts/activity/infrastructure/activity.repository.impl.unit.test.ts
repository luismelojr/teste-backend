import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityEntity } from './activity.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ActivityRepositoryImpl,
} from 'activity/infrastructure/activity.repository.impl';

export const activity = {
  name: 'Mock name',
  description: 'description test',
};

export const createActivity = {
  name: 'Mock name',
  description: 'description test',
};

describe('ActivityRepositoryImpl', () => {
  let repository: ActivityRepositoryImpl;
  let mockRepository: Repository<ActivityEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createActivity }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createActivity }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...activity }),
      softremove: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...activity },
          { id: '2', ...activity },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${activity.name}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      ActivityRepositoryImpl,
      {
        provide: getRepositoryToken(ActivityEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<ActivityRepositoryImpl>(ActivityRepositoryImpl);
    mockRepository = module.get<Repository<ActivityEntity>>(
      getRepositoryToken(ActivityEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new Activity', async () => {
      const result = await repository.create(new Activity(createActivity));
      expect(mockRepository.save).toBeCalledWith(expect.any(ActivityEntity));
      expect(result).toBeInstanceOf(Activity);
    });
  });

  describe('update', () => {
    it('should update an existing Activity', async () => {
      const updatedActivity = new Activity({ id: '1', ...createActivity });
      const result = await repository.update(updatedActivity);
      expect(mockRepository.save).toBeCalledWith(expect.any(ActivityEntity));
      expect(result).toBeInstanceOf(Activity);
    });
  });

  describe('delete', () => {
    it('should throw an error if Activity not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(repository.delete('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('should return by ID', async () => {
      const result = await repository.findOneById('1');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { id: '1' },
      });
      expect(result).toBeInstanceOf(Activity);
    });
  });

  describe('findOneByUuid', () => {
    it('should return by UUID', async () => {
      const result = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
      });
      expect(result).toBeInstanceOf(Activity);
    });
  });

  describe('findAll', () => {
    it('should return paginated results without searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const result = await repository.findAll({ pagination });
      expect(mockRepository.findAndCount).toBeCalledWith({
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
        name: `${activity.name}`,
        uuid: 'uuid',
      });
    });
  });
});
