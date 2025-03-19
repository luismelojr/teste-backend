import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateActivity } from './update-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';

const uuid = generateUuidV4();

describe('UpdateActivity', () => {
  let useCase: UpdateActivity;
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

    const useCases: Provider[] = [UpdateActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateActivity>(UpdateActivity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update activity', async () => {
      mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      mockActivityRepository.update.mockResolvedValue(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockActivity,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockActivityRepository.update).toHaveBeenCalledWith(new Activity({
        ...mockActivity,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockActivity.name,
      });
    });
  });

  it('should update activity without city', async () => {
    mockActivityRepository.findOneByUuid.mockResolvedValue(new Activity({
      ...mockActivity,
      id: '1',
      uuid: uuid,
    }));

    mockActivityRepository.update.mockResolvedValue(new Activity({
      ...mockActivity,
      id: '1',
      uuid: uuid,
    }));

    const executeCommand = {
      ...mockActivity,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockActivityRepository.update).toHaveBeenCalledWith(new Activity({
      ...mockActivity,
      id: '1',
      uuid: uuid,
    }));

    expect(result).toEqual({
      uuid: uuid,
      name: mockActivity.name,
    });
  });


  it('should throw NotFoundException when not has Activity with uuid', async () => {
    mockActivityRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockActivity,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('activity is not found'),
    );
  });
});
