import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidEventType } from './find-by-uuid-event-type';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';


describe('FindByUuidEventType', () => {
  let useCase: FindByUuidEventType;
  let mockEventTypeRepository;

  const uuid = generateUuidV4();
  const mockEventType = {
    uuid,
    name: 'Patria Agronegócios',
    description: 'Descrição',
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

    const useCases: Provider[] = [FindByUuidEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidEventType>(FindByUuidEventType);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid EventType', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(new EventType({
        ...mockEventType,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockEventTypeRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockEventType.name,
        description: mockEventType.description,
      });
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

    it('should throw NotFoundException when not has Event Type with uuid', async () => {
      mockEventTypeRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('event type is not found'),
      );
    });
  });
});
