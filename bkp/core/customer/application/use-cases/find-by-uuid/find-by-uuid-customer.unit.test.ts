import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, Provider } from '@nestjs/common';
import { FindByUuidCustomer } from './find-by-uuid-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Customer } from '../../../domain/customer';

describe('FindByUuidCustomer', () => {
  let useCase: FindByUuidCustomer;
  let mockCustomerRepository;

  const uuid = generateUuidV4();

  const mockCustomer = new Customer({
    id: 1,
    uuid,
    identifier: 'CUSTOMER-001',
    group_identifier: 'GROUP-01',
    description: 'Cliente do setor agrícola',
    financial_tools: true,
    grain_consumer: true,
    own_grain: true,
    annual_quantity: 10000,
    receive_third_grains: false,
    receives_land_rent: false,
  });

  beforeEach(async () => {
    mockCustomerRepository = {
      findOneByUuid: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [FindByUuidCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidCustomer>(FindByUuidCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a customer when found', async () => {
      mockCustomerRepository.findOneByUuid.mockResolvedValue(mockCustomer);

      const result = await useCase.execute({ uuid });

      expect(mockCustomerRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid,
        identifier: 'CUSTOMER-001',
        group_identifier: 'GROUP-01',
        description: 'Cliente do setor agrícola',
        financial_tools: true,
        grain_consumer: true,
        own_grain: true,
        annual_quantity: 10000,
        receive_third_grains: false,
        receives_land_rent: false,
      });
    });

    it('should throw BadRequestException when uuid is missing', async () => {
      await expect(useCase.execute({ uuid: undefined })).rejects.toThrow(
        new BadRequestException('Customer UUID is required'),
      );
    });

    it('should throw NotFoundException when customer is not found', async () => {
      mockCustomerRepository.findOneByUuid.mockResolvedValue(undefined);

      await expect(useCase.execute({ uuid })).rejects.toThrow(
        new NotFoundException('Customer not found'),
      );
    });
  });
});
