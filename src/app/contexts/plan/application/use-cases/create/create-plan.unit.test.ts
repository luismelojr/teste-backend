import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreatePlan } from './create-plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { Plan } from 'plan/domain/plan';

const uuid = generateUuidV4();

describe('CreatePlan', () => {
  let useCase: CreatePlan;
  let mockPlanRepository;

  const mockPlan = {
    name: 'Plano Consultoria',
    description: 'Patria Agronegócios descricao',
  };

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

    const useCases: Provider[] = [CreatePlan];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreatePlan>(CreatePlan);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create Plan', async () => {
      mockPlanRepository.create.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockPlan.name,
        description: mockPlan.description,
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        uuid: uuid,
        name: mockPlan.name,
        description: mockPlan.description,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockPlanRepository.findOneByUuid.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        description: mockPlan.description,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('name is required'),
      );
    });
  });
});
