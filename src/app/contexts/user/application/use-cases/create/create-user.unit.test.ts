import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { CreateUser } from './create-user';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { faker } from '@faker-js/faker';
import { UserRepository } from 'user/infrastructure/user.repository';
import {
  RegisterUserCognito,
} from 'user/application/use-cases/cognito/register-user-cognito';
import { User } from 'user/domain/user';

const uuid = generateUuidV4();

describe('CreateUser', () => {
  let useCase: CreateUser;
  let mockUserRepository;
  let mockPersonRepository;
  let mockRegisterUserCognito;

  const mockPerson = {
    name: 'Tony Stark',
    cpf: '61765766443',
    phone: '999999999',
    address: 'Wall Street',
    gender: PersonGenderType.MALE,
  };

  const mockUser = {
    id: '1',
    uuid,
    cognitoId: generateUuidV4(),
    username: '00000000000',
    email: faker.internet.email(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
    };

    mockPersonRepository = {
      findOneByUuid: jest.fn(),
    };

    mockRegisterUserCognito = {
      execute: jest.fn().mockResolvedValue({ uuid: generateUuidV4() }),
    };

    const infrastructure: Provider[] = [
      {
        provide: UserRepository,
        useValue: mockUserRepository,
      },
      {
        provide: PersonRepository,
        useValue: mockPersonRepository,
      },
    ];

    const useCases: Provider[] = [
      CreateUser,
      {
        provide: RegisterUserCognito,
        useValue: mockRegisterUserCognito,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateUser>(CreateUser);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a user with valid data', async () => {
      const executeCommand = {
        username: '61765766443',
        email: faker.internet.email(),
        person: {
          ...mockPerson,
        },
      };

      mockUserRepository.create.mockResolvedValue(new User({
        ...mockUser,
        person: {
          id: '1',
          uuid: generateUuidV4(),
          ...mockPerson,
        },
      }));

      const result = await useCase.execute(executeCommand);

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        uuid: mockUser.uuid,
        cognitoId: mockUser.cognitoId,
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(mockRegisterUserCognito.execute).toBeCalled();
    });

    it('should throw BadRequestException if username is missing', async () => {
      const executeCommand = {
        username: undefined,
        email: faker.internet.email(),
        person: { ...mockPerson },
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is missing', async () => {
      const executeCommand = {
        username: '61765766443',
        person: { ...mockPerson },
        email: undefined,
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if person data is missing', async () => {
      const executeCommand = {
        username: '61765766443',
        email: faker.internet.email(),
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(new BadRequestException('Personal data is required'));
    });

    it('should throw NotFoundException if person UUID is not found', async () => {
      const executeCommand = {
        username: '61765766443',
        email: faker.internet.email(),
        person: { ...mockPerson, uuid: generateUuidV4() },
      };

      mockPersonRepository.findOneByUuid.mockResolvedValue(null);

      await expect(useCase.execute(executeCommand)).rejects.toThrow(NotFoundException);
    });

    it('should reuse existing person if UUID is found', async () => {
      const existingPerson = {
        id: '1',
        uuid: generateUuidV4(),
        ...mockPerson,
      };

      mockPersonRepository.findOneByUuid.mockResolvedValue(existingPerson);
      mockUserRepository.create.mockResolvedValue(new User({
        ...mockUser,
        person: existingPerson,
      }));

      const executeCommand = {
        username: '61765766443',
        email: faker.internet.email(),
        person: { ...mockPerson, uuid: existingPerson.uuid },
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPersonRepository.findOneByUuid).toHaveBeenCalledWith(existingPerson.uuid);
      expect(result).toMatchObject({
        uuid: mockUser.uuid,
        cognitoId: mockUser.cognitoId,
        username: mockUser.username,
        email: mockUser.email,
      });
    });
  });
});
