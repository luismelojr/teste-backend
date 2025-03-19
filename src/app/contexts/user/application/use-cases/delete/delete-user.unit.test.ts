import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeleteUser } from './delete-user';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { UserRepository } from 'user/infrastructure/user.repository';
import { faker } from '@faker-js/faker';
import { User } from 'user/domain/user';
import {
  DisableUserCognito,
} from 'user/application/use-cases/cognito/disable-user-cognito';

const uuid = generateUuidV4();

describe('DeleteUser', () => {
  let useCase: DeleteUser;
  let mockUserRepository;
  let mockDisableUserCognito;

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
      delete: jest.fn(),
      findOneByUuid: jest.fn(),
    };

    mockDisableUserCognito = {
      execute: jest.fn().mockResolvedValue({ uuid: generateUuidV4() }),
    };

    const infrastructure: Provider[] = [
      {
        provide: UserRepository,
        useValue: mockUserRepository,
      },
    ];

    const useCases: Provider[] = [
      DeleteUser,
      {
        provide: DisableUserCognito,
        useValue: mockDisableUserCognito,
      }];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteUser>(DeleteUser);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(new User({
        ...mockUser,
        id: '1',
        person: {
          ...mockPerson,
          id: '1',
          uuid: uuid,
        },
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(uuid);
      expect(mockDisableUserCognito.execute).toBeCalled();
    });
    it('should throw BadRequestException when not has uuid', async () => {
      mockUserRepository.findOneByUuid.mockResolvedValue(new User({
        ...mockUser,
        id: '1',
        person: {
          ...mockPerson,
          id: '1',
          uuid: uuid,
        },
      }));

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
        new NotFoundException('user not found'),
      );
    });

  });
});
