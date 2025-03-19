import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdatePlan } from './update-plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { Plan } from 'plan/domain/plan';

const uuid = generateUuidV4();

describe('UpdatePlan', () => {
  let useCase: UpdatePlan;
  let mockPlanRepository;

  const mockPlan = {
    name: 'Plano Consultoria',
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

    const useCases: Provider[] = [UpdatePlan];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdatePlan>(UpdatePlan);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update plan', async () => {
      mockPlanRepository.findOneByUuid.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
        uuid: uuid,
      }));

      mockPlanRepository.update.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockPlan,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPlanRepository.update).toHaveBeenCalledWith(new Plan({
        ...mockPlan,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockPlan.name,
        functions: [],
      });
    });
  });

  it('should update plan without city', async () => {
    mockPlanRepository.findOneByUuid.mockResolvedValue(new Plan({
      ...mockPlan,
      id: '1',
      uuid: uuid,
    }));

    mockPlanRepository.update.mockResolvedValue(new Plan({
      ...mockPlan,
      id: '1',
      uuid: uuid,
    }));

    const executeCommand = {
      ...mockPlan,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockPlanRepository.update).toHaveBeenCalledWith(new Plan({
      ...mockPlan,
      id: '1',
      uuid: uuid,
    }));

    expect(result).toEqual({
      uuid: uuid,
      name: mockPlan.name,
      functions: [],
    });
  });


  it('should throw NotFoundException when not has Plan with uuid', async () => {
    mockPlanRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockPlan,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('plan is not found'),
    );
  });
});
