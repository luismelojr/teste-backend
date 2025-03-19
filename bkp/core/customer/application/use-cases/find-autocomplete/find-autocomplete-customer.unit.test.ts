import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteCustomer } from './find-autocomplete-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

describe('FindAutocompleteCustomer', () => {
  let useCase: FindAutocompleteCustomer;
  let mockCustomerRepository;

  const uuid1 = generateUuidV4();
  const uuid2 = generateUuidV4();

  const mockCustomers = [
    { uuid: uuid1, identifier: 'CUSTOMER-001' },
    { uuid: uuid2, identifier: 'CUSTOMER-002' },
  ];

  beforeEach(async () => {
    mockCustomerRepository = {
      findAutoComplete: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompleteCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteCustomer>(FindAutocompleteCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return autocomplete customers', async () => {
      const query = 'CUSTOMER';
      mockCustomerRepository.findAutoComplete.mockResolvedValue(mockCustomers);

      const result = await useCase.execute({ query });

      expect(mockCustomerRepository.findAutoComplete).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockCustomers);
    });

    it('should return an empty list when no customers match', async () => {
      const query = 'UNKNOWN';
      mockCustomerRepository.findAutoComplete.mockResolvedValue([]);

      const result = await useCase.execute({ query });

      expect(mockCustomerRepository.findAutoComplete).toHaveBeenCalledWith(query);
      expect(result).toEqual([]);
    });
  });
});
