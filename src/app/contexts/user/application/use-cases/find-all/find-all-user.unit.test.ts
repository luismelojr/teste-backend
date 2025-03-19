import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllUser } from './find-all-user';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';
import { UserRepository } from 'user/infrastructure/user.repository';
import { User } from 'user/domain/user';

describe('FindAllPerson', () => {
  let useCase: FindAllUser;
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

    const useCases: Provider[] = [FindAllUser];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllUser>(FindAllUser);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll User', async () => {
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

      const user1 = {
        id: '1',
        uuid: generateUuidV4(),
        cognitoId: generateUuidV4(),
        username: '61765766443',
        email: 'teste@email.com.br',
      };

      const user2 = {
        id: '2',
        uuid: generateUuidV4(),
        cognitoId: generateUuidV4(),
        username: '61765766443',
        email: 'teste@email.com.br',
      };

      mockUserRepository.findAll.mockResolvedValue({
        data: [
          new User({
            ...user1,
            person: {
              ...mockPerson1,
            },
          }),
          new User({
            ...user2,
            person:{
              ...mockPerson2,
            },
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
