import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import {
  FindAutocompleteCultivation
} from 'commons/cultivations/application/use-cases/find-autocomplete/find-autocomplete-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';


describe('FindAutocompleteCultivation', () => {
  let useCase: FindAutocompleteCultivation;
  let mockCultivationRepository;

  beforeEach(async () => {
    mockCultivationRepository = {
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
        provide: CultivationRepository,
        useValue: mockCultivationRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompleteCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteCultivation>(FindAutocompleteCultivation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Cultivation', async () => {
      const query = '61765';
      mockCultivationRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Patria Agronegócios' },
          { name: 'Patria Agronegócios2' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockCultivationRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
