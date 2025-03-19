import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateActivity } from './create-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';

const uuid = generateUuidV4();

describe('CreateActivity', () => {
  let useCase: CreateActivity;
  let mockActivityRepository;

  const mockActivity = {
    name: 'Atividade',
    description: 'Descricao atividade',
  };

  beforeEach(async () => {
    mockActivityRepository = {
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
        provide: ActivityRepository,
        useValue: mockActivityRepository,
      },
    ];

    const useCases: Provider[] = [CreateActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateActivity>(CreateActivity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create Activity', async () => {
      mockActivityRepository.create.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockActivity.name,
        description: mockActivity.description,
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        uuid: uuid,
        name: mockActivity.name,
        description: mockActivity.description,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        description: mockActivity.description,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('name is required'),
      );
    });
  });
});
