import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateCustomer } from './create-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Customer } from '../../../domain/customer';

describe('CreateCustomer', () => {
  let useCase: CreateCustomer;
  let mockCustomerRepository;

  const uuid = generateUuidV4();
  const mockCustomer = {
    identifier: 'CUSTOMER-001',
    group_identifier: 'GROUP-01',
    description: 'Cliente do setor agrícola',
    financial_tools: true,
    grain_consumer: true,
    own_grain: true,
    annual_quantity: 10000,
    receive_third_grains: false,
    receives_land_rent: false,
  };

  beforeEach(async () => {
    mockCustomerRepository = {
      create: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [CreateCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateCustomer>(CreateCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a full customer', async () => {
      mockCustomerRepository.create.mockResolvedValue(
        new Customer({
          ...mockCustomer,
          id: 1,
          uuid,
        }),
      );

      const result = await useCase.execute(mockCustomer);

      expect(mockCustomerRepository.create).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual({
        uuid,
        ...mockCustomer,
      });
    });

    it('should create a partial customer (only identifier)', async () => {
      const partialCustomer = { identifier: 'CUSTOMER-002' };

      mockCustomerRepository.create.mockResolvedValue(
        new Customer({
          ...partialCustomer,
          id: 2,
          uuid: generateUuidV4(),
        }),
      );

      const result = await useCase.execute(partialCustomer);

      expect(mockCustomerRepository.create).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual({
        uuid: expect.any(String),
        identifier: 'CUSTOMER-002',
        group_identifier: undefined,
        description: undefined,
        financial_tools: undefined,
        grain_consumer: undefined,
        own_grain: undefined,
        annual_quantity: undefined,
        receive_third_grains: undefined,
        receives_land_rent: undefined,
      });
    });

    it('should throw BadRequestException when identifier is missing', async () => {
      const executeCommand = { ...mockCustomer, identifier: undefined };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(
        new BadRequestException('Identifier is required'),
      );
    });

    it('should throw BadRequestException when group_identifier is provided but other required fields are missing', async () => {
      const executeCommand = {
        identifier: 'CUSTOMER-003',
        group_identifier: 'GROUP-02',
        financial_tools: undefined,
        grain_consumer: undefined,
        receives_land_rent: undefined,
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(
        new BadRequestException('Financial Tools is required'),
      );
    });

    it('should throw an error when own_grain, annual_quantity or receive_third_grains are set but grain_consumer is false', async () => {
      const executeCommand = {
        ...mockCustomer,
        grain_consumer: false,
        own_grain: true,
        annual_quantity: 5000,
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(
        new Error('Os campos own_grain, annual_quantity e receive_third_grains só podem ser preenchidos se grain_consumer for true.'),
      );
    });
  });
});
