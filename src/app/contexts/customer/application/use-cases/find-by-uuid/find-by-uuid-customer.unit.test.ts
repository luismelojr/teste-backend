import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindByUuidCustomer } from './find-by-uuid-customer';
import { Customer } from 'customer/domain/customer';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  FindByUuidCustomerOutputAdapter,
} from 'customer/application/use-cases/find-by-uuid/find-by-uuid-customer-output.adapter';


describe('FindByUuidCustomer', () => {
  let useCase: FindByUuidCustomer;
  let customerRepository;

  const uuid = generateUuidV4();

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
        FindByUuidCustomer,
        {
          provide: CustomerRepository,
          useValue: {
            findOneByUuid: jest.fn().mockResolvedValue(
              savedCustomer,
            ),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindByUuidCustomer>(FindByUuidCustomer);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Occupation', async () => {
      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);
      const expectedResult = FindByUuidCustomerOutputAdapter.execute(savedCustomer);

      expect(customerRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual(expectedResult);
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

    it('should throw NotFoundException when not has Occupation with uuid', async () => {
      customerRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('Customer is not found'),
      );
    });
  });
});
