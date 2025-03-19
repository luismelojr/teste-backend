import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateEventType } from './create-event-type';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';

const uuid = generateUuidV4();

describe('CreateEventType', () => {
  let useCase: CreateEventType;
  let mockEventTypeRepository;

  const mockEventType = {
    name: 'Patria Agronegócios',
    description: 'Patria Agronegócios descricao',
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

    const useCases: Provider[] = [CreateEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateEventType>(CreateEventType);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create EventType', async () => {
      mockEventTypeRepository.create.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockEventType.name,
        description: mockEventType.description,
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        uuid: uuid,
        name: mockEventType.name,
        description: mockEventType.description,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        description: mockEventType.description,
      };

      await expect(
          useCase.execute(executeCommand),
      ).rejects.toThrow(
          new BadRequestException('name is required'),
      );
    });
  });
});
