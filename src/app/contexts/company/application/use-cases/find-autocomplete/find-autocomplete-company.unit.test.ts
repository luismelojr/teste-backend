import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteCompany } from './find-autocomplete-company';
import { CompanyRepository } from 'company/infrastructure/company.repository';

const cnpj = '90798163000154';

describe('FindAutocompleteCompany', () => {
  let useCase: FindAutocompleteCompany;
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

    const useCases: Provider[] = [FindAutocompleteCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteCompany>(FindAutocompleteCompany);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Company', async () => {
      const query = '61765';
      mockCompanyRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Patria Agronegócios', cnpj },
          { name: 'Patria Agronegócios2', cnpj },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockCompanyRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
