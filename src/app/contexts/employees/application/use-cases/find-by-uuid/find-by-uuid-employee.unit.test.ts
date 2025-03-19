import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindOneByUuidEmployee } from './find-by-uuid-employee';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';
import { Employee } from '../../../domain/employee';


describe('FindByUuidEmployee', () => {
  let useCase: FindOneByUuidEmployee;
  let mockEmployeeRepository;

  const uuid = generateUuidV4();
  const mockEmployee = {
    uuid,
    business_phone: "62982296414",
    business_email: "junimhs100@gmail.com",
    contract_type: "CLT" as ContractTypeInterface,
    occupation: "teste",
    start_date: new Date()
  };


  beforeEach(async () => {
    mockEmployeeRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneById: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      findAutocomplete: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: EmployeeRepository,
        useValue: mockEmployeeRepository,
      },
    ];

    const useCases: Provider[] = [FindOneByUuidEmployee];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindOneByUuidEmployee>(FindOneByUuidEmployee);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid employee', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockEmployeeRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        business_phone: mockEmployee.business_phone,
        business_email: mockEmployee.business_email,
        contract_type: mockEmployee.contract_type,
        occupation: mockEmployee.occupation,
        start_date: mockEmployee.start_date
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: undefined,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('uuid is required'),
      );
    });

    it('should throw NotFoundException when not has employee with uuid', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('employee not found'),
      );
    });
  });
});
