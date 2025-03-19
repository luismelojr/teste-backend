import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllCompany } from './find-all-company';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { faker } from '@faker-js/faker';
import { Company } from 'company/domain/company';

const cnpj = '90798163000154';

describe('FindAllCompany', () => {
  let useCase: FindAllCompany;
  let mockCompanyRepository;

  beforeEach(async () => {
    mockCompanyRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneById: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      findAutocomplete: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CompanyRepository,
        useValue: mockCompanyRepository,
      },
    ];

    const useCases: Provider[] = [FindAllCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllCompany>(FindAllCompany);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll company', async () => {
      const mockCompany1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
        tradeName: 'Patria Agronegócio',
        cnpj,
        phone: '999999999',
        address: 'Wall Street',
        email: faker.internet.email(),
      };
      const mockCompany2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
        tradeName: 'Patria Agronegócio',
        cnpj,
        phone: '999999999',
        address: 'Wall Street',
        email: faker.internet.email(),
      };

      mockCompanyRepository.findAll.mockResolvedValue({
        data: [
          new Company({
            ...mockCompany1,
          }),
          new Company({
            ...mockCompany2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockCompanyRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
