import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteOccupation } from './find-autocomplete-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';


describe('FindAutocompleteOccupation', () => {
  let useCase: FindAutocompleteOccupation;
  let mockOccupationRepository;

  beforeEach(async () => {
    mockOccupationRepository = {
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
        provide: OccupationRepository,
        useValue: mockOccupationRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompleteOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteOccupation>(FindAutocompleteOccupation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Occupation', async () => {
      const query = '61765';
      mockOccupationRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Agrônomo' },
          { name: 'Agrônomo2' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockOccupationRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
