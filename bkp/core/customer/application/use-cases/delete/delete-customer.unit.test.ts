import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, Provider } from '@nestjs/common';
import { DeleteCustomer } from './delete-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Customer } from '../../../domain/customer';

describe('DeleteCustomer', () => {
  let useCase: DeleteCustomer;
  let mockCustomerRepository;

  const uuid = generateUuidV4();
  const mockCustomer = {
    id: 1,
    uuid,
    identifier: 'CUSTOMER-001',
    group_identifier: 'GROUP-01',
    financial_tools: true,
    grain_consumer: true,
    receives_land_rent: false,
  };

  beforeEach(async () => {
    mockCustomerRepository = {
      findOneByUuid: jest.fn(),
      delete: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [DeleteCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteCustomer>(DeleteCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a customer', async () => {
      mockCustomerRepository.findOneByUuid.mockResolvedValue(new Customer(mockCustomer));
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await useCase.execute({ uuid });

      expect(mockCustomerRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(mockCustomerRepository.delete).toHaveBeenCalledWith(uuid);
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
