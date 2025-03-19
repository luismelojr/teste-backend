import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Employee } from '../../../domain/employee';
import { DeleteEmployee } from './delete-employee';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';

const uuid = generateUuidV4();

describe('DeleteEmployee', () => {
  let useCase: DeleteEmployee;
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

    const useCases: Provider[] = [DeleteEmployee];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteEmployee>(DeleteEmployee);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete employee', async () => {
      mockEmployeeRepository.findOneByUuid.mockResolvedValue(new Employee({
        ...mockEmployee,
        id: 1,
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockEmployeeRepository.delete).toHaveBeenCalledWith(uuid);
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
        new BadRequestException('Employee UUID is required'),
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
        new NotFoundException('Employee not found'),
      );
    });
  });
});
