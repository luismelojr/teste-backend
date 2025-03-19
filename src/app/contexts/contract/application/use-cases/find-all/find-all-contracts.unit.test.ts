import { Test, TestingModule } from '@nestjs/testing';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { FindAllContracts } from './find-all-contracts';
import { Contract } from 'contract/domain/contract';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { PaginationOutput } from 'shared/abstracts/paginations/pagination.output';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

describe('FindAllContracts UseCase', () => {
  let findAllContracts: FindAllContracts;
  let contractRepository;

  const pagination: PaginationInput = {
    page: 1,
    maxPageSize: 10,
  };

  const planData = {
    id: '1',
    uuid: generateUuidV4(),
    name: 'Plano Premium',
    description: 'Plano com todos os recursos',
  };

  const companyData = {
    id: '2',
    uuid: generateUuidV4(),
    name: 'ACME Corporation',
    cnpj: '12.345.678/0001-90',
  };

  const mockContracts = [
    new Contract({
      id: '1',
      uuid: generateUuidV4(),
      identifier: 'CT-001',
      description: 'Contrato 1',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: planData,
      company: {
        id: companyData.id,
        uuid: companyData.uuid,
        name: companyData.name,
        cnpj: companyData.cnpj,
      },
    }),
    new Contract({
      id: '2',
      uuid: generateUuidV4(),
      identifier: 'CT-002',
      description: 'Contrato 2',
      startDate: new Date('2023-02-01'),
      endDate: new Date('2023-11-30'),
      plan: planData,
      company: {
        id: companyData.id,
        uuid: companyData.uuid,
        name: companyData.name,
        cnpj: companyData.cnpj,
      },
    }),
  ];

  const mockPaginationResult: PaginationOutput<Contract> = {
    data: mockContracts,
    total: mockContracts.length,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllContracts,
        {
          provide: ContractRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    findAllContracts = module.get<FindAllContracts>(FindAllContracts);
    contractRepository = module.get<ContractRepository>(ContractRepository);
  });

  it('should return paginated contracts', async () => {
    contractRepository.findAll.mockResolvedValue(mockPaginationResult);

    const result = await findAllContracts.execute({ pagination });

    expect(contractRepository.findAll).toHaveBeenCalledWith({
      pagination,
      searchText: undefined,
    });

    expect(result.total).toBe(mockContracts.length);
    expect(result.data).toHaveLength(mockContracts.length);

    expect(result.data[0].identifier).toBe(mockContracts[0].identifier);
    expect(result.data[0].plan.name).toBe(mockContracts[0].plan.name);
    expect(result.data[0].company.name).toBe(mockContracts[0].company.name);
    expect(result.data[1].identifier).toBe(mockContracts[1].identifier);
  });

  it('should search contracts with searchText', async () => {
    const searchText = 'CT-00';

    const filteredResult: PaginationOutput<Contract> = {
      data: [mockContracts[0]],
      total: 1,
    };

    contractRepository.findAll.mockResolvedValue(filteredResult);

    const result = await findAllContracts.execute({
      pagination,
      searchText,
    });

    expect(contractRepository.findAll).toHaveBeenCalledWith({
      pagination,
      searchText,
    });

    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].identifier).toBe(mockContracts[0].identifier);
  });

  it('should return empty array when no contracts found', async () => {
    const emptyResult: PaginationOutput<Contract> = {
      data: [],
      total: 0,
    };

    contractRepository.findAll.mockResolvedValue(emptyResult);

    const result = await findAllContracts.execute({ pagination });

    expect(result.total).toBe(0);
    expect(result.data).toHaveLength(0);
  });
});
