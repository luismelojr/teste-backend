import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllPerson } from './find-all-person';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';

describe('FindAllPerson', () => {
  let useCase: FindAllPerson;
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

    const useCases: Provider[] = [FindAllPerson];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllPerson>(FindAllPerson);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Person', async () => {
      const mockPerson1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Tony Stark',
        cpf: '61765766443',
        phone: '999999999',
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };
      const mockPerson2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Steve Rogers',
        cpf: '61765766443',
        phone: '999999999',
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };

      mockPersonRepository.findAll.mockResolvedValue({
        data: [
          new Person({
            ...mockPerson1,
          }),
          new Person({
            ...mockPerson2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockPersonRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
