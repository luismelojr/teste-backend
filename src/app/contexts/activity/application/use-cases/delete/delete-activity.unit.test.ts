import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeleteActivity } from './delete-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';

const uuid = generateUuidV4();

describe('DeleteActivity', () => {
  let useCase: DeleteActivity;
  let mockActivityRepository;

  const mockActivity = {
    name: 'Patria Agronegócios',
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

    const useCases: Provider[] = [DeleteActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteActivity>(DeleteActivity);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete Activity', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockActivityRepository.delete).toHaveBeenCalledWith(uuid);
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
        new NotFoundException('activity not found'),
      );
    });

  });
});
