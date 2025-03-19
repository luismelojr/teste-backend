import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidUser } from './find-by-uuid-user';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { UserRepository } from 'user/infrastructure/user.repository';
import { User } from 'user/domain/user';

describe('FindByUuidUser', () => {
  let useCase: FindByUuidUser;
  let mockUserRepository;

  const uuid = generateUuidV4();
  const mockPerson = {
    uuid,
    name: 'Tony Stark',
    cpf: '61765766443',
    phone: '999999999',
    address: 'Wall Street',
    gender: PersonGenderType.MALE,
  };

  const mockUser = {
    uuid: uuid,
    cognitoId: generateUuidV4(),
    username: '61765766443',
    email: 'teste@email.com.br',
  };

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

    const useCases: Provider[] = [FindByUuidUser];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidUser>(FindByUuidUser);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Person', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(
        new User({
          ...mockUser,
          person: {
            ...mockPerson,
            id: '1',
          },
        }),
      );

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockUserRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        cognitoId: mockUser.cognitoId,
        username: mockUser.username,
        email: mockUser.email,
        person: {
          uuid: uuid,
          name: mockPerson.name,
          cpf: mockPerson.cpf,
        },
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(
        new User({
          ...mockUser,
          person: {
            ...mockPerson,
            id: '1',
          },
        }),
      );

      const executeCommand = {
        uuid: undefined,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('uuid is required'),
      );
    });

    it('should throw NotFoundException when not has user with uuid', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('user is not found'),
      );
    });
  });
});
