import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdatePerson } from './update-person';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { CityService } from 'commons/locations/city/application/city.service';
import { Person } from 'person/domain/person';
import { City } from 'commons/locations/city/domain/city';

const uuid = generateUuidV4();

describe('UpdatePerson', () => {
  let useCase: UpdatePerson;
  let mockPersonRepository;
  let mockCityService;

  const mockCity = {
    id: '1',
    uuid: uuid,
    name: 'Sào Paulo',
    state: null,
  };

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

    const useCases: Provider[] = [UpdatePerson];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdatePerson>(UpdatePerson);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update Person', async () => {
      mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
        city: new City({ ...mockCity }),
      }));

      mockPersonRepository.update.mockResolvedValue(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
      }));

      mockCityService.findOneByUuid.mockResolvedValue(new City({ ...mockCity }));

      const executeCommand = {
        ...mockPerson,
        uuid: uuid,
        city: {
          uuid: uuid,
        },
      };

      const result = await useCase.execute(executeCommand);

      expect(mockPersonRepository.update).toHaveBeenCalledWith(new Person({
        ...mockPerson,
        id: '1',
        uuid: uuid,
        city: new City({ ...mockCity }),
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
  });

  it('should update Person without city', async () => {
    mockPersonRepository.findOneByUuid.mockResolvedValue(new Person({
      ...mockPerson,
      id: '1',
      uuid: uuid,
    }));

    mockPersonRepository.update.mockResolvedValue(new Person({
      ...mockPerson,
      id: '1',
      uuid: uuid,
    }));

    const executeCommand = {
      ...mockPerson,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockPersonRepository.update).toHaveBeenCalledWith(new Person({
      ...mockPerson,
      id: '1',
      uuid: uuid,
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


  it('should throw NotFoundException when not has person with uuid', async () => {
    mockPersonRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockPerson,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('person is not found'),
    );
  });
});
