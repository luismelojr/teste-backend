import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllPlan } from './find-all-plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { Plan } from 'plan/domain/plan';


describe('FindAllPlan', () => {
  let useCase: FindAllPlan;
  let mockPlanRepository;

  beforeEach(async () => {
    mockPlanRepository = {
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
        provide: PlanRepository,
        useValue: mockPlanRepository,
      },
    ];

    const useCases: Provider[] = [FindAllPlan];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllPlan>(FindAllPlan);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Plan', async () => {
      const mockPlan1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Plano Consultoria',
      };
      const mockPlan2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Plano Consultoria',
      };

      mockPlanRepository.findAll.mockResolvedValue({
        data: [
          new Plan({
            ...mockPlan1,
          }),
          new Plan({
            ...mockPlan2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockPlanRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
