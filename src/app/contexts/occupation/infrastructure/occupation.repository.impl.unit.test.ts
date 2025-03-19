import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { Occupation } from '../domain/occupation';
import { OccupationEntity } from './occupation.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  OccupationRepositoryImpl
} from './occupation.repository.impl';
export const occupation = {
  name: 'Mock name',
  description: 'description test',
};

export const createOccupation = {
  name: 'Mock name',
  description: 'description test',
};

describe('OccupationRepositoryImpl', () => {
  let repository: OccupationRepositoryImpl;
  let mockRepository: Repository<OccupationEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createOccupation }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createOccupation }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...occupation }),
      softremove: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...occupation },
          { id: '2', ...occupation },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${occupation.name}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      OccupationRepositoryImpl,
      {
        provide: getRepositoryToken(OccupationEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<OccupationRepositoryImpl>(OccupationRepositoryImpl);
    mockRepository = module.get<Repository<OccupationEntity>>(
      getRepositoryToken(OccupationEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new Occupation', async () => {
      const result = await repository.create(new Occupation(createOccupation));
      expect(mockRepository.save).toBeCalledWith(expect.any(OccupationEntity));
      expect(result).toBeInstanceOf(Occupation);
    });
  });

  describe('update', () => {
    it('should update an existing Occupation', async () => {
      const updatedOccupation = new Occupation({ id: '1', ...createOccupation });
      const result = await repository.update(updatedOccupation);
      expect(mockRepository.save).toBeCalledWith(expect.any(OccupationEntity));
      expect(result).toBeInstanceOf(Occupation);
    });
  });

  describe('delete', () => {
    it('should throw an error if Occupation not found', async () => {
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
      expect(result).toBeInstanceOf(Occupation);
    });
  });

  describe('findOneByUuid', () => {
    it('should return by UUID', async () => {
      const result = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
      });
      expect(result).toBeInstanceOf(Occupation);
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
        name: `${occupation.name}`,
        uuid: 'uuid',
      });
    });
  });
});
