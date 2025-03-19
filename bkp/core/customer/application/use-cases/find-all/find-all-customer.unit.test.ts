import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAllCustomer } from './find-all-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { Customer } from '../../../domain/customer';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';

describe('FindAllCustomer', () => {
  let useCase: FindAllCustomer;
  let mockCustomerRepository;

  const uuid1 = generateUuidV4();
  const uuid2 = generateUuidV4();

  const mockCustomers = [
    new Customer({
      id: 1,
      uuid: uuid1,
      identifier: 'CUSTOMER-001',
      group_identifier: 'GROUP-01',
      description: 'Cliente do setor agrícola',
      financial_tools: true,
      grain_consumer: true,
      own_grain: true,
      annual_quantity: 10000,
      receive_third_grains: false,
      receives_land_rent: false,
    }),
    new Customer({
      id: 2,
      uuid: uuid2,
      identifier: 'CUSTOMER-002',
      group_identifier: 'GROUP-02',
      description: 'Cliente do setor financeiro',
      financial_tools: true,
      grain_consumer: false,
      own_grain: undefined,
      annual_quantity: undefined,
      receive_third_grains: undefined,
      receives_land_rent: true,
    }),
  ];

  beforeEach(async () => {
    mockCustomerRepository = {
      findAll: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [FindAllCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllCustomer>(FindAllCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated customers', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };
      mockCustomerRepository.findAll.mockResolvedValue({
        data: mockCustomers,
        total: 2,
      });

      const result = await useCase.execute({ pagination });

      expect(mockCustomerRepository.findAll).toHaveBeenCalledWith({
        pagination,
        searchText: undefined,
      });

      expect(result).toEqual({
        data: [
          {
            uuid: uuid1,
            identifier: 'CUSTOMER-001',
            group_identifier: 'GROUP-01',
            description: 'Cliente do setor agrícola',
            financial_tools: true,
            grain_consumer: true,
            own_grain: true,
            annual_quantity: 10000,
            receive_third_grains: false,
            receives_land_rent: false,
          },
          {
            uuid: uuid2,
            identifier: 'CUSTOMER-002',
            group_identifier: 'GROUP-02',
            description: 'Cliente do setor financeiro',
            financial_tools: true,
            grain_consumer: false,
            own_grain: undefined,
            annual_quantity: undefined,
            receive_third_grains: undefined,
            receives_land_rent: true,
          },
        ],
        total: 2,
      });
    });

    it('should return filtered customers when searchText is provided', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };
      const searchText = 'CUSTOMER-001';

      mockCustomerRepository.findAll.mockResolvedValue({
        data: [mockCustomers[0]],
        total: 1,
      });

      const result = await useCase.execute({ pagination, searchText });

      expect(mockCustomerRepository.findAll).toHaveBeenCalledWith({ pagination, searchText });

      expect(result).toEqual({
        data: [
          {
            uuid: uuid1,
            identifier: 'CUSTOMER-001',
            group_identifier: 'GROUP-01',
            description: 'Cliente do setor agrícola',
            financial_tools: true,
            grain_consumer: true,
            own_grain: true,
            annual_quantity: 10000,
            receive_third_grains: false,
            receives_land_rent: false,
          },
        ],
        total: 1,
      });
    });

    it('should return empty list when no customers found', async () => {
      const pagination: PaginationInput = { page: 1, maxPageSize: 10 };

      mockCustomerRepository.findAll.mockResolvedValue({ data: [], total: 0 });

      const result = await useCase.execute({ pagination });

      expect(mockCustomerRepository.findAll).toHaveBeenCalledWith({
        pagination,
        searchText: undefined,
      });

      expect(result).toEqual({ data: [], total: 0 });
    });
  });
});
