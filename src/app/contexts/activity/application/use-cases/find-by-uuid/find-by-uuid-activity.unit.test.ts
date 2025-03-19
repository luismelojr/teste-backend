import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidActivity } from './find-by-uuid-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';

describe('FindByUuidActivity', () => {
  let useCase: FindByUuidActivity;
  let mockActivityRepository;

  const uuid = generateUuidV4();
  const mockActivity = {
    uuid,
    name: 'Patria Agronegócios',
    description: 'Patria Agronegócio',
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

    const useCases: Provider[] = [FindByUuidActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidActivity>(FindByUuidActivity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Activity', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockActivityRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockActivity.name,
        description: mockActivity.description,
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
        ...mockActivity,
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

    it('should throw NotFoundException when not has Activity with uuid', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('activity is not found'),
      );
    });
  });
});
