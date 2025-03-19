import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DeleteCustomer,
} from 'customer/application/use-cases/delete/delete-customer';
import { Customer } from 'customer/domain/customer';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';

const uuid = generateUuidV4();

describe('DeleteCustomer', () => {
  let useCase: DeleteCustomer;
  let customerRepository;

  const savedCustomer = new Customer({
    id: '1',
    uuid: generateUuidV4(),
    identifier: 'CUST-001',
    groupIdentifier: 'GROUP-001',
    description: 'Customer Test',
    financialTools: true,
    receivesLandRent: false,
    grainConsumer: {
      isConsumer: true,
      isOwnGrain: false,
      isReceiveThirdGrains: false,
      annualQuantity: 1000,
    },
    locations: [],
    activities: [],
    persons: [],
    cropInformation: [],
    crops: [],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCustomer,
        {
          provide: CustomerRepository,
          useValue: {
            'delete': jest.fn(),
            findOneByUuid: jest.fn().mockResolvedValue(savedCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteCustomer>(DeleteCustomer);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete customer', async () => {
      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(customerRepository.delete).toHaveBeenCalledWith(uuid);
    });
    it('should throw BadRequestException when not has uuid', async () => {
      const executeCommand = {
        uuid: undefined,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('uuid is required'),
      );
    });

    it('should throw NotFoundException when not has customer with uuid', async () => {
      customerRepository.delete.mockRejectedValueOnce(new Error('Customer not found'));

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('Customer not found'),
      );
    });

  });
});
