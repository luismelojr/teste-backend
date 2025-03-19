import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeleteEventType } from './delete-event-type';
import { faker } from '@faker-js/faker';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';

const uuid = generateUuidV4();

describe('DeleteEventType', () => {
  let useCase: DeleteEventType;
  let mockEventTypeRepository;

  const mockEventType = {
    name: 'Patria Agronegócios',
  };

  beforeEach(async () => {
    mockEventTypeRepository = {
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
        provide: EventTypeRepository,
        useValue: mockEventTypeRepository,
      },
    ];

    const useCases: Provider[] = [DeleteEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteEventType>(DeleteEventType);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete EventType', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockEventTypeRepository.delete).toHaveBeenCalledWith(uuid);
    });
    it('should throw BadRequestException when not has uuid', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
        ...mockEventType,
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

    it('should throw NotFoundException when not has EventType with uuid', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('eventType not found'),
      );
    });

  });
});
