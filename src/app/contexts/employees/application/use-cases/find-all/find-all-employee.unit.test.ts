import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllEmployee } from './find-all-employee';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { Employee } from '../../../domain/employee';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';


describe('FindAllEmployee', () => {
  let useCase: FindAllEmployee;
  let mockEmployeeRepository;

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

    const useCases: Provider[] = [FindAllEmployee];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllEmployee>(FindAllEmployee);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Employee', async () => {
      const mockEmployee1 = {
        id: 1,
        uuid: generateUuidV4(),
        business_phone: "62982296414",
        business_email: "junimhs100@gmail.com",
        contract_type: "CLT" as ContractTypeInterface,
        occupation: "teste",
        start_date: new Date()
      };
      const mockEmployee2 = {
        id: 2,
        uuid: generateUuidV4(),
        business_phone: "62982296414",
        business_email: "junimhs100@gmail.com",
        contract_type: "CLT" as ContractTypeInterface,
        occupation: "teste",
        start_date: new Date()
      };

      mockEmployeeRepository.findAll.mockResolvedValue({
        data: [
          new Employee({
            ...mockEmployee1,
          }),
          new Employee({
            ...mockEmployee2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockEmployeeRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
