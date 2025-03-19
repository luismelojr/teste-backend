import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeletePerson } from './delete-person';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';

const uuid = generateUuidV4();

describe('DeletePerson', () => {
  let useCase: DeletePerson;
  let mockPersonRepository;

  const mockPerson = {
    uuid: uuid,
    name: 'Tony Stark',
    cpf: '61765766443',
    phone: '999999999',
    address: 'Wall Street',
    gender: PersonGenderType.MALE,
  };

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

    const useCases: Provider[] = [DeletePerson];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeletePerson>(DeletePerson);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete Person', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockPersonRepository.delete).toHaveBeenCalledWith(uuid);
    });
    it('should throw BadRequestException when not has uuid', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
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

    it('should throw NotFoundException when not has person with uuid', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('person not found'),
      );
    });

  });
});
