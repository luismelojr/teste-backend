import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateEmployee } from './update-employee';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { Employee } from '../../../domain/employee';

const uuid = generateUuidV4();

describe('UpdateEmployee', () => {
  let useCase: UpdateEmployee;
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

    const useCases: Provider[] = [UpdateEmployee];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateEmployee>(UpdateEmployee);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update employee', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      mockEmployeeRepository.update.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockEmployee,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        business_phone: mockEmployee.business_phone,
        business_email: mockEmployee.business_email,
        contract_type: mockEmployee.contract_type,
        occupation: mockEmployee.occupation,
        start_date: mockEmployee.start_date,
        shutdown_date: undefined,
      });
    });
  });


  it('should throw NotFoundException when not has employee with uuid', async () => {
    mockEmployeeRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockEmployee,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('employee is not found'),
    );
  });
});
