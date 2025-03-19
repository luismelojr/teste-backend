import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateUser } from './update-user';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { faker } from '@faker-js/faker';
import { UserRepository } from 'user/infrastructure/user.repository';
import { User } from 'user/domain/user';
import {
  UpdateUserCognito,
} from 'user/application/use-cases/cognito/update-user-cognito';

const uuid = generateUuidV4();

describe('UpdateUser', () => {
  let useCase: UpdateUser;
  let mockUserRepository;
  let mockUpdateUserCognito;

  const mockPerson = {
    uuid: uuid,
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
      update: jest.fn(),
      findOneByUuid: jest.fn(),
    };

    mockUpdateUserCognito = {
      execute: jest.fn().mockResolvedValue({ uuid: generateUuidV4() }),
    };

    const infrastructure: Provider[] = [
      {
        provide: UserRepository,
        useValue: mockUserRepository,
      },
    ];

    const useCases: Provider[] = [
      UpdateUser,
      {
        provide: UpdateUserCognito,
        useValue: mockUpdateUserCognito,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateUser>(UpdateUser);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update User', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(new User({
        ...mockUser,
        id: '1',
        person: {
          ...mockPerson,
          id: '1',
          uuid: uuid,
        },
      }));

      mockUserRepository.update.mockResolvedValue(new User({
        ...mockUser,
        id: '1',
        person: {
          ...mockPerson,
          id: '1',
          uuid: uuid,
        },
      }));

      const executeCommand = {
        ...mockUser,
        person: {
          uuid: mockPerson.uuid,
        },
      };

      const result = await useCase.execute(executeCommand);

      expect(mockUserRepository.update).toHaveBeenCalledWith(new User({
        ...mockUser,
        person: {
          ...mockPerson,
          id: '1',
          uuid: uuid,
        },
      }));

      expect(result).toEqual({
        uuid: uuid,
        cognitoId: mockUser.cognitoId,
        username: mockUser.username,
        email: mockUser.email,
      });

      expect(mockUpdateUserCognito.execute).toBeCalled();

    });
    it('should throw NotFoundException when not has user with uuid', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        ...mockUser,
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
