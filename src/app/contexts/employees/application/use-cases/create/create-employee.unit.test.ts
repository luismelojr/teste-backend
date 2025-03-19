import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateEmployee } from './create-employee';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Employee } from '../../../domain/employee';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';

const uuid = generateUuidV4();

describe('CreateEmployee', () => {
  let useCase: CreateEmployee;
  let mockEmployeeRepository;

  const mockEmployee = {
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

    const useCases: Provider[] = [CreateEmployee];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateEmployee>(CreateEmployee);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create employee', async () => {
      mockEmployeeRepository.create.mockResolvedValue(
        new Employee({
          ...mockEmployee,
          id: 1,
          uuid,
        }),
      );

      const executeCommand = {
        business_phone: mockEmployee.business_phone,
        business_email: mockEmployee.business_email,
        contract_type: mockEmployee.contract_type,
        occupation: mockEmployee.occupation,
        start_date: mockEmployee.start_date
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        ...mockEmployee,
        id: 1,
        uuid,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      const executeCommand = {
        business_phone: undefined,
        business_email: mockEmployee.business_email,
        contract_type: mockEmployee.contract_type,
        occupation: mockEmployee.occupation,
        start_date: mockEmployee.start_date
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('business_phone is required'),
      );
    });
  });
});
