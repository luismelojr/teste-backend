import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteEventType } from './find-autocomplete-event-type';
import { EventTypeRepository } from 'event-type/infrastructure/event-type.repository';


describe('FindAutocompleteEventType', () => {
  let useCase: FindAutocompleteEventType;
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

    const useCases: Provider[] = [FindAutocompleteEventType];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteEventType>(FindAutocompleteEventType);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete EventType', async () => {
      const query = '61765';
      mockEventTypeRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Patria Agronegócios' },
          { name: 'Patria Agronegócios2' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockEventTypeRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
