import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepositoryImpl } from './company.repository.impl';
import { Provider } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Company } from '../domain/company';
import { CompanyEntity } from './company.entity';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const cnpj = '90798163000154';

export const company = {
  name: faker.company.name(),
  tradeName: faker.company.name(),
  cnpj,
  phone: '999999999',
  address: 'Wall Street',
  email: faker.internet.email(),
};

export const createCompany = {
  name: faker.company.name(),
  tradeName: faker.company.name(),
  cnpj,
  phone: '999999999',
  address: 'Wall Street',
  email: faker.internet.email(),
};

describe('CompanyRepositoryImpl', () => {
  let repository: CompanyRepositoryImpl;
  let mockRepository: Repository<CompanyEntity>;
  let repositoryMock;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({ id: '1', ...createCompany }),
      update: jest.fn().mockResolvedValue({ id: '1', ...createCompany }),
      findOne: jest.fn().mockResolvedValue({ id: '1', ...company }),
      softRemove: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([
        [
          { id: '1', ...company },
          { id: '2', ...company },
        ],
        2,
      ]),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { name: `${company.name} - ${company.cnpj}`, uuid: 'uuid' },
        ]),
      })),
    };

    const infrastructure: Provider[] = [
      CompanyRepositoryImpl,
      {
        provide: getRepositoryToken(CompanyEntity),
        useValue: repositoryMock,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure],
    }).compile();

    repository = module.get<CompanyRepositoryImpl>(CompanyRepositoryImpl);
    mockRepository = module.get<Repository<CompanyEntity>>(
      getRepositoryToken(CompanyEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const companyReturn = await repository.create(new Company(createCompany));
      expect(mockRepository.save).toBeCalledWith(expect.any(CompanyEntity));
      expect(companyReturn).toBeInstanceOf(Company);
    });
  });

  describe('update', () => {
    it('should update an existing company', async () => {
      const updatedcompany = new Company({ id: '1', ...createCompany });
      const result = await repository.update(updatedcompany);
      expect(mockRepository.save).toBeCalledWith(expect.any(CompanyEntity));
      expect(result).toBeInstanceOf(Company);
    });
  });

  describe('delete', () => {
    it('should soft delete a company', async () => {
      const uuid = 'uuid';
      repositoryMock.findOne.mockResolvedValue({ id: '1', ...company });
      await repository.delete(uuid);
      expect(mockRepository.softRemove).toBeCalledWith({ id: '1', ...company });
    });

    it('should throw an error if company not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      await expect(repository.delete('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('should return a company by ID', async () => {
      const companyResult = await repository.findOneById('1');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { id: '1' },
        relations: ['city'],
      });
      expect(companyResult).toBeInstanceOf(Company);
    });
  });

  describe('findOneByUuid', () => {
    it('should return a company by UUID', async () => {
      const companyResult = await repository.findOneByUuid('uuid');
      expect(mockRepository.findOne).toBeCalledWith({
        where: { uuid: 'uuid' },
        relations: ['city'],
      });
      expect(companyResult).toBeInstanceOf(Company);
    });
  });

  describe('findAll', () => {
    it('should return paginated results without searchText', async () => {
      const pagination = { maxPageSize: 10, page: 1 };
      const relations = ['city'];
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

      const relations = ['city'];
      const result = await repository.findAll({ pagination, searchText });
      expect(mockRepository.findAndCount).toBeCalledWith({
        relations,
        where: [
          { name: ILike(`%${searchText}%`) },
          { tradeName: ILike(`%${searchText}%`) },
          { cnpj: ILike(`%${searchText}%`) },
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
        name: `${company.name} - ${company.cnpj}`,
        uuid: 'uuid',
      });
    });
  });
});
