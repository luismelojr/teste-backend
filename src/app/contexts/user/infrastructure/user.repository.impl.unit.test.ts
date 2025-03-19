import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryImpl } from './user.repository.impl';
import { Provider } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User } from '../domain/user';
import { UserEntity } from './user.entity';
import { DataSource, ILike, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { PersonEntity } from 'person/infrastructure/person.entity';

const cpf = '61765766443';
const uuid = generateUuidV4();

const person = {
  id: '1',
  uuid: generateUuidV4(),
  name: 'Steve Rogers',
  cpf,
};

const user = {
  id: '1',
  uuid,
  cognitoId: generateUuidV4(),
  username: '00000000000',
  email: faker.internet.email(),
};

const createUser = {
  cognitoId: generateUuidV4(),
  username: '00000000000',
  email: faker.internet.email(),
};


describe('PersonRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let mockRepository: Repository<UserEntity>;
  let dataSource: DataSource;
  let repositoryMock;
  let dataSourceMock;
  let queryRunner;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({
        ...createUser,
        id: '1',
        uuid: uuid,
        person: { ...person },
      }),
      update: jest.fn().mockResolvedValue({
        ...createUser,
        id: '1',
        uuid: uuid,
        person: { ...person },
      }),
      findOne: jest.fn().mockResolvedValue({ ...user, person: { ...person } }),
      softDelete: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { ...user, id: '1', person: { ...person } },
          { ...user, id: '2', person: { ...person } },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${user.username} - ${user.email}`, uuid: 'uuid' },
        ]),
      })),
    };

    dataSourceMock = {
      createQueryRunner: jest.fn(),
    };

    const infrastructure: Provider[] = [
      UserRepositoryImpl,
      {
        provide: getRepositoryToken(UserEntity),
        useValue: repositoryMock,
      },
      {
        provide: DataSource,
        useValue: dataSourceMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    repository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    mockRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
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
    it('should create a new User with a new Person if no person ID is provided', async () => {
      const toCreateUser = new User({
        ...createUser,
        person: { name: 'Steve Rogers', cpf },
      });


      const entityCreateUser = {
        ...createUser,
        id: '1',
        uuid,
        person: {
          ...person,
        },
      } as UserEntity;

      repositoryMock.findOne.mockResolvedValue(entityCreateUser);

      queryRunner.manager.findOne.mockResolvedValue(null);
      queryRunner.manager.save.mockResolvedValueOnce({ ...person });
      queryRunner.manager.save.mockResolvedValueOnce(entityCreateUser);

      const result = await repository.create(toCreateUser);

      expect(dataSource.createQueryRunner).toBeCalled();
      expect(queryRunner.connect).toBeCalled();
      expect(queryRunner.startTransaction).toBeCalled();

      expect(queryRunner.manager.save).toHaveBeenNthCalledWith(1, expect.any(PersonEntity));
      expect(queryRunner.manager.save).toHaveBeenNthCalledWith(2, expect.any(UserEntity));

      expect(queryRunner.commitTransaction).toBeCalled();
      expect(queryRunner.release).toBeCalled();

      expect(result).toBeInstanceOf(User);
    });

    it('should create a new User with an existing Person if person ID is provided', async () => {
      const toCreateUser = new User({
        ...createUser,
        person: { id: '1', ...person },
      });

      queryRunner.manager.findOne.mockResolvedValue(person);
      queryRunner.manager.save.mockResolvedValueOnce({
        ...toCreateUser,
        id: '1',
        uuid,
      });

      const result = await repository.create(toCreateUser);

      expect(queryRunner.manager.findOne).toBeCalledWith(PersonEntity, { where: { id: '1' } });
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.save).toBeCalledWith(expect.any(UserEntity));

      expect(queryRunner.commitTransaction).toBeCalled();
      expect(result).toBeInstanceOf(User);
    });

    it('should rollback transaction if error occurs', async () => {
      const toCreateUser = new User({
        ...createUser,
        person: { name: 'Tony Stark', cpf },
      });

      queryRunner.manager.save.mockRejectedValueOnce(new Error('Database Error'));

      await expect(repository.create(toCreateUser)).rejects.toThrow('Database Error');

      expect(queryRunner.rollbackTransaction).toBeCalled();
      expect(queryRunner.release).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update an existing User', async () => {
      const toUpdatedUser = new User({
        id: '1',
        uuid: uuid, ...createUser,
        person: { ...person },
      });
      const result = await repository.update(toUpdatedUser);
      expect(mockRepository.save).toBeCalledWith(expect.any(UserEntity));
      expect(result).toBeInstanceOf(User);
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      const uuid = 'uuid';
      repositoryMock.findOne.mockResolvedValue({ ...user });
      await repository.delete(uuid);
      expect(mockRepository.softDelete).toBeCalledWith('1');
    });

    it('should throw an error if user not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(repository.delete('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const personResult = await repository.findOneById('1');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { id: '1' },
        relations: ['person'],
      });
      expect(personResult).toBeInstanceOf(User);
    });
  });

  describe('findOneByUuid', () => {
    it('should return a user by UUID', async () => {
      const personResult = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
        relations: ['person'],
      });
      expect(personResult).toBeInstanceOf(User);
    });
  });

  describe('findAll', () => {
    it('should return paginated results without searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const relations = ['person'];
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

      const relations = ['person'];
      const result = await repository.findAll({ pagination, searchText });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations,
        where: [
          { username: ILike(`%${searchText}%`) },
          { email: ILike(`%${searchText}%`) },
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
        name: `${user.username} - ${user.email}`,
        uuid: 'uuid',
      });
    });
  });
});
