import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreatePerson } from './create-person';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { CityService } from 'commons/locations/city/application/city.service';
import { Person } from 'person/domain/person';
import { City } from 'commons/locations/city/domain/city';

const uuid = generateUuidV4();

describe('CreatePerson', () => {
  let useCase: CreatePerson;
  let mockPersonRepository;
  let mockCityService;

  const mockPerson = {
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

    mockCityService = {
      findOneByUuid: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: PersonRepository,
        useValue: mockPersonRepository,
      },
      {
        provide: CityService,
        useValue: mockCityService,
      },
    ];

    const useCases: Provider[] = [CreatePerson];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreatePerson>(CreatePerson);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create Person', async () => {
      mockPersonRepository.create.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      const mockCity = new City({
        id: '1',
        uuid: uuid,
        name: 'Sào Paulo',
        state: null,
      });

      mockCityService.findOneByUuid.mockResolvedValue(mockCity);

      const executeCommand = {
        name: 'Tony Stark',
        cpf: '61765766443',
        phone: '999999999',
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPersonRepository.create).toHaveBeenCalledWith(new Person({
        ...mockPerson,
        city: mockCity,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockPerson.name,
        cpf: mockPerson.cpf,
        phone: mockPerson.phone,
        city: {
          uuid: uuid,
        },
        address: mockPerson.address,
        gender: mockPerson.gender,
      });
    });

    it('should create Person when city is not present', async () => {
      mockPersonRepository.create.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: 'Tony Stark',
        cpf: '61765766443',
        phone: '999999999',
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPersonRepository.create).toHaveBeenCalledWith(new Person({
        ...mockPerson,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockPerson.name,
        cpf: mockPerson.cpf,
        phone: mockPerson.phone,
        address: mockPerson.address,
        gender: mockPerson.gender,
      });
    });

    it('should throw BadRequestException when not has name', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        cpf: '61765766443',
        phone: '999999999',
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('name is required'),
      );
    });

    it('should throw BadRequestException when not has cpf', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: 'Tony Stark',
        cpf: undefined,
        phone: '999999999',
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        gender: PersonGenderType.MALE,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('cpf is required'),
      );
    });
  });
});
