import { Test, TestingModule } from '@nestjs/testing';
import { PersonRepositoryImpl } from './person.repository.impl';
import { Provider } from '@nestjs/common';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from '../domain/person';
import { PersonEntity } from './person.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const cpf = '61765766443';

export const person = {
  name: 'Nome legal',
  cpf,
  gender: PersonGenderType.MALE,
};

export const createPerson = {
  name: 'Nome legal completo',
  cpf,
  phone: '999999999',
  address: 'Wall Street',
  gender: PersonGenderType.MALE,
};

describe('PersonRepositoryImpl', () => {
  let repository: PersonRepositoryImpl;
  let mockRepository: Repository<PersonEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createPerson }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createPerson }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...person }),
      softDelete: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...person },
          { id: '2', ...person },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${person.name} - ${person.cpf}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      PersonRepositoryImpl,
      {
        provide: getRepositoryToken(PersonEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<PersonRepositoryImpl>(PersonRepositoryImpl);
    mockRepository = module.get<Repository<PersonEntity>>(
      getRepositoryToken(PersonEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new Person', async () => {
      const personReturn = await repository.create(new Person(createPerson));
      expect(mockRepository.save).toBeCalledWith(expect.any(PersonEntity));
      expect(personReturn).toBeInstanceOf(Person);
    });
  });

  describe('update', () => {
    it('should update an existing Person', async () => {
      const updatedPerson = new Person({ id: '1', ...createPerson });
      const result = await repository.update(updatedPerson);
      expect(mockRepository.save).toBeCalledWith(expect.any(PersonEntity));
      expect(result).toBeInstanceOf(Person);
    });
  });

  describe('delete', () => {
    it('should soft delete a Person and clear CPF', async () => {
      const uuid = 'uuid';
      repositoryMock.findOne.mockResolvedValue({ id: '1', ...person });
      await repository.delete(uuid);
      expect(mockRepository.save).toBeCalledWith(
        expect.objectContaining({ cpf: null }),
      );
      expect(mockRepository.softDelete).toBeCalledWith('1');
    });

    it('should throw an error if person not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(repository.delete('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('should return a Person by ID', async () => {
      const personResult = await repository.findOneById('1');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { id: '1' },
        relations: ['city', 'city.state'],
      });
      expect(personResult).toBeInstanceOf(Person);
    });
  });

  describe('findOneByUuid', () => {
    it('should return a Person by UUID', async () => {
      const personResult = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
        relations: ['city', 'city.state'],
      });
      expect(personResult).toBeInstanceOf(Person);
    });
  });

  describe('findAll', () => {
    it('should return paginated results without searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const relations = ['city', 'city.state'];
      const result = await repository.findAll({ pagination });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations,
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

      const relations = ['city', 'city.state'];
      const result = await repository.findAll({ pagination, searchText });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations,
        where: [
          { name: ILike(`%${searchText}%`) },
          { cpf: ILike(`%${searchText}%`) },
          { phone: ILike(`%${searchText}%`) },
          { address: ILike(`%${searchText}%`) },
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
        name: `${person.name} - ${person.cpf}`,
        uuid: 'uuid',
      });
    });
  });
});
