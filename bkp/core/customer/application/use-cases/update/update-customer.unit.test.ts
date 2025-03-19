import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, Provider } from '@nestjs/common';
import { UpdateCustomer } from './update-customer';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Customer } from '../../../domain/customer';

describe('UpdateCustomer', () => {
  let useCase: UpdateCustomer;
  let mockCustomerRepository;

  const uuid = generateUuidV4();

  const baseCommand = {
    uuid,
    identifier: 'UPDATED-001',
    group_identifier: 'GROUP-02',
    description: 'Updated description',
    financial_tools: false,
    grain_consumer: true, // Grain consumer TRUE permite preencher os outros campos
    own_grain: true,
    annual_quantity: 5000,
    receive_third_grains: true,
    receives_land_rent: true,
  };

  beforeEach(async () => {
    mockCustomerRepository = {
      findOneByUuid: jest.fn(),
      update: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CustomerRepository,
        useValue: mockCustomerRepository,
      },
    ];

    const useCases: Provider[] = [UpdateCustomer];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateCustomer>(UpdateCustomer);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a full customer (with all fields)', async () => {
      mockCustomerRepository.findOneByUuid.mockResolvedValue(new Customer(baseCommand));
      mockCustomerRepository.update.mockResolvedValue(new Customer(baseCommand));

      const result = await useCase.execute(baseCommand);

      expect(mockCustomerRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(mockCustomerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual(baseCommand);
    });

    it('should update a partial customer (only identifier)', async () => {
      const partialCommand = { uuid, identifier: 'UPDATED-002' };

      mockCustomerRepository.findOneByUuid.mockResolvedValue(new Customer(partialCommand));
      mockCustomerRepository.update.mockResolvedValue(new Customer(partialCommand));

      const result = await useCase.execute(partialCommand);

      expect(mockCustomerRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(mockCustomerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual({
        uuid,
        identifier: 'UPDATED-002',
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

    it('should update a customer with grain_consumer = false and clear conditional fields', async () => {
      const commandWithGrainConsumerFalse = {
        ...baseCommand,
        grain_consumer: false,
        own_grain: undefined,
        annual_quantity: undefined,
        receive_third_grains: undefined,
      };

      mockCustomerRepository.findOneByUuid.mockResolvedValue(new Customer(commandWithGrainConsumerFalse));
      mockCustomerRepository.update.mockResolvedValue(new Customer(commandWithGrainConsumerFalse));

      const result = await useCase.execute(commandWithGrainConsumerFalse);

      expect(mockCustomerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual(commandWithGrainConsumerFalse);
    });

    it('should throw BadRequestException when uuid is missing', async () => {
      await expect(
        useCase.execute({ ...baseCommand, uuid: undefined } as any)
      ).rejects.toThrow(new BadRequestException('Customer UUID is required'));
    });

    it('should throw BadRequestException when identifier is missing', async () => {
      await expect(
        useCase.execute({ ...baseCommand, identifier: undefined } as any)
      ).rejects.toThrow(new BadRequestException('Identifier is required'));
    });

    it('should throw BadRequestException when group_identifier is provided but required fields are missing', async () => {
      const commandWithMissingFields = {
        uuid,
        identifier: 'UPDATED-003',
        group_identifier: 'GROUP-03',
        financial_tools: undefined,
        grain_consumer: undefined,
        receives_land_rent: undefined,
      };

      mockCustomerRepository.findOneByUuid.mockResolvedValue(
        new Customer({
          uuid,
          identifier: 'UPDATED-003',
          group_identifier: 'GROUP-03',
        }),
      );

      await expect(useCase.execute(commandWithMissingFields)).rejects.toThrow(
        new BadRequestException('Financial Tools is required'),
      );
    });

    it('should throw NotFoundException when customer is not found', async () => {
      mockCustomerRepository.findOneByUuid.mockResolvedValue(undefined);

      await expect(useCase.execute(baseCommand)).rejects.toThrow(
        new NotFoundException('Customer not found'),
      );
    });
  });
});
