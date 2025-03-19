import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllEventType } from './find-all-event-type';
import {
  EventTypeRepository,
} from 'event-type/infrastructure/event-type.repository';
import { EventType } from 'event-type/domain/event-type';


describe('FindAllEventType', () => {
  let useCase: FindAllEventType;
  let mockEventTypeRepository;

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

    const useCases: Provider[] = [FindAllEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllEventType>(FindAllEventType);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll EventType', async () => {
      const mockEventType1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };
      const mockEventType2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };

      mockEventTypeRepository.findAll.mockResolvedValue({
        data: [
          new EventType({
            ...mockEventType1,
          }),
          new EventType({
            ...mockEventType2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockEventTypeRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
