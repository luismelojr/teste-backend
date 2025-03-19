import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { FindAllCustomer } from './find-all-customer';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import { Customer } from 'customer/domain/customer';


describe('FindAllOccupation', () => {
  let useCase: FindAllCustomer;
  let customerRepository;

  const savedCustomer1 = new Customer({
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

  const savedCustomer2 = new Customer({
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
        FindAllCustomer,
        {
          provide: CustomerRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue({
              data: [savedCustomer1, savedCustomer2],
              total: 2,
            }),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllCustomer>(FindAllCustomer);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Occupation', async () => {
      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);
      expect(customerRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
