import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompletePerson } from './find-autocomplete-person';
import { PersonRepository } from 'person/infrastructure/person.repository';

describe('FindAutocompletePerson', () => {
  let useCase: FindAutocompletePerson;
  let mockPersonRepository;

  beforeEach(async () => {
    mockPersonRepository = {
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
        provide: PersonRepository,
        useValue: mockPersonRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompletePerson];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompletePerson>(FindAutocompletePerson);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Person', async () => {
      const query = '61765';
      mockPersonRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Tony Stark', cpf: '61765766443' },
          { name: 'Steve Rogers', cpf: '61765766443' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockPersonRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
