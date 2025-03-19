import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteUser } from './find-autocomplete-user';
import { UserRepository } from 'user/infrastructure/user.repository';

describe('FindAutocompleteUser', () => {
  let useCase: FindAutocompleteUser;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
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
        provide: UserRepository,
        useValue: mockUserRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompleteUser];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteUser>(FindAutocompleteUser);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete User', async () => {
      const query = '61765';
      mockUserRepository.findAutocomplete.mockResolvedValue(
        [
          { name: 'Tony Stark', cpf: '61765766443' },
          { name: 'Steve Rogers', cpf: '61765766443' },
        ],
      );

      const executeCommand = {
        query,
      };

      await useCase.execute(executeCommand);

      expect(mockUserRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
