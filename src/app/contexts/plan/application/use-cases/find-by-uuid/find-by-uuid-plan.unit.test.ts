import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidPlan } from './find-by-uuid-plan';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { Plan } from 'plan/domain/plan';

describe('FindByUuidPlan', () => {
  let useCase: FindByUuidPlan;
  let mockPlanRepository;

  const uuid = generateUuidV4();
  const mockPlan = {
    uuid,
    name: 'Plano Consultoria',
    description: 'Patria Agronegócio',
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

    const useCases: Provider[] = [FindByUuidPlan];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidPlan>(FindByUuidPlan);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Plan', async () => {
      mockPlanRepository.findOneByUuid.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPlanRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockPlan.name,
        description: mockPlan.description,
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockPlanRepository.findOneByUuid.mockResolvedValue(new Plan({
        ...mockPlan,
        id: '1',
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

    it('should throw NotFoundException when not has Plan with uuid', async () => {
      mockPlanRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('plan is not found'),
      );
    });
  });
});
