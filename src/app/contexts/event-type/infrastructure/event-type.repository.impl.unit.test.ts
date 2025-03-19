import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { EventType } from '../domain/event-type';
import { EventTypeEntity } from './event-type.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  EventTypeRepositoryImpl
} from 'event-type/infrastructure/event-type.repository.impl';
export const eventType = {
  name: 'Mock name',
  description: 'description test',
};

export const createEventType = {
  name: 'Mock name',
  description: 'description test',
};

describe('EventTypeRepositoryImpl', () => {
  let repository: EventTypeRepositoryImpl;
  let mockRepository: Repository<EventTypeEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createEventType }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createEventType }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...eventType }),
      softremove: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...eventType },
          { id: '2', ...eventType },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${eventType.name}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      EventTypeRepositoryImpl,
      {
        provide: getRepositoryToken(EventTypeEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<EventTypeRepositoryImpl>(EventTypeRepositoryImpl);
    mockRepository = module.get<Repository<EventTypeEntity>>(
      getRepositoryToken(EventTypeEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new EventType', async () => {
      const result = await repository.create(new EventType(createEventType));
      expect(mockRepository.save).toBeCalledWith(expect.any(EventTypeEntity));
      expect(result).toBeInstanceOf(EventType);
    });
  });

  describe('update', () => {
    it('should update an existing EventType', async () => {
      const updatedEventType = new EventType({ id: '1', ...createEventType });
      const result = await repository.update(updatedEventType);
      expect(mockRepository.save).toBeCalledWith(expect.any(EventTypeEntity));
      expect(result).toBeInstanceOf(EventType);
    });
  });

  describe('delete', () => {
    it('should throw an error if EventType not found', async () => {
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
      expect(result).toBeInstanceOf(EventType);
    });
  });

  describe('findOneByUuid', () => {
    it('should return by UUID', async () => {
      const result = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
      });
      expect(result).toBeInstanceOf(EventType);
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
        name: `${eventType.name}`,
        uuid: 'uuid',
      });
    });
  });
});
