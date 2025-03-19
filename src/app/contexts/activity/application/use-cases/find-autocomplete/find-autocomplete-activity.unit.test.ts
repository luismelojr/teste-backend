import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteActivity } from './find-autocomplete-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';


describe('FindAutocompleteActivity', () => {
  let useCase: FindAutocompleteActivity;
  let mockActivityRepository;

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

    const useCases: Provider[] = [FindAutocompleteActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteActivity>(FindAutocompleteActivity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Activity', async () => {
      const query = '61765';
      mockActivityRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Patria Agronegócios' },
          { name: 'Patria Agronegócios2' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockActivityRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
