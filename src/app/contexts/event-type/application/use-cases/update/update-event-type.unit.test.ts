import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateEventType } from './update-event-type';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';

const uuid = generateUuidV4();

describe('UpdateEventType', () => {
  let useCase: UpdateEventType;
  let mockEventTypeRepository;

  const mockEventType = {
    name: 'Patria Agronegócios',
    description: 'descrição',
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

    const useCases: Provider[] = [UpdateEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateEventType>(UpdateEventType);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update eventType', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      mockEventTypeRepository.update.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockEventType,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockEventTypeRepository.update).toHaveBeenCalledWith(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockEventType.name,
        description: mockEventType.description,
      });
    });
  });

  it('should update eventType without city', async () => {
    mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
      ...mockEventType,
      id: '1',
      uuid: uuid,
    }));

    mockEventTypeRepository.update.mockResolvedValue(new EventType({
      ...mockEventType,
      id: '1',
      uuid: uuid,
    }));

    const executeCommand = {
      ...mockEventType,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockEventTypeRepository.update).toHaveBeenCalledWith(new EventType({
      ...mockEventType,
      id: '1',
      uuid: uuid,
    }));

    expect(result).toEqual({
      uuid: uuid,
      name: mockEventType.name,
      description: mockEventType.description,
    });
  });


  it('should throw NotFoundException when not has EventType with uuid', async () => {
    mockEventTypeRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockEventType,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('event type is not found'),
    );
  });
});
