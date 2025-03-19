import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompletePlan } from './find-autocomplete-plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';


describe('FindAutocompletePlan', () => {
  let useCase: FindAutocompletePlan;
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

    const useCases: Provider[] = [FindAutocompletePlan];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompletePlan>(FindAutocompletePlan);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Plan', async () => {
      const query = '61765';
      mockPlanRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Plano Consultoria' },
          { name: 'Plano Consultoria2' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockPlanRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
