import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateCompany } from './update-company';
import { CityService } from 'commons/locations/city/application/city.service';
import { City } from 'commons/locations/city/domain/city';
import { faker } from '@faker-js/faker';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { Company } from 'company/domain/company';

const uuid = generateUuidV4();
const cnpj = '90798163000154';

describe('UpdateCompany', () => {
  let useCase: UpdateCompany;
  let mockCompanyRepository;
  let mockCityService;

  const mockCity = {
    id: '1',
    uuid: uuid,
    name: 'São Paulo',
  };

  const mockCompany = {
    name: 'Patria Agronegócios',
    tradeName: 'Patria Agronegócio',
    cnpj,
    phone: '999999999',
    address: 'Wall Street',
    email: faker.internet.email(),
  };

  beforeEach(async () => {
    mockCompanyRepository = {
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
        provide: CompanyRepository,
        useValue: mockCompanyRepository,
      },
      {
        provide: CityService,
        useValue: mockCityService,
      },
    ];

    const useCases: Provider[] = [UpdateCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateCompany>(UpdateCompany);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update company', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      mockCompanyRepository.update.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      mockCityService.findOneByUuid.mockResolvedValue(new City({
        ...mockCity,
        state: undefined,
      }));

      const executeCommand = {
        ...mockCompany,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCompanyRepository.update).toHaveBeenCalledWith(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockCompany.name,
        tradeName: mockCompany.tradeName,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        address: mockCompany.address,
        email: mockCompany.email,
      });
    });
  });

  it('should update company without city', async () => {
    mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
      ...mockCompany,
      id: '1',
      uuid: uuid,
    }));

    mockCompanyRepository.update.mockResolvedValue(new Company({
      ...mockCompany,
      id: '1',
      uuid: uuid,
      city: { id: undefined, uuid: undefined },
    }));

    const executeCommand = {
      ...mockCompany,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockCompanyRepository.update).toHaveBeenCalledWith(new Company({
      ...mockCompany,
      id: '1',
      uuid: uuid,
      city: undefined,
    }));

    expect(result).toEqual({
      uuid: uuid,
      name: mockCompany.name,
      tradeName: mockCompany.tradeName,
      cnpj: mockCompany.cnpj,
      phone: mockCompany.phone,
      address: mockCompany.address,
      email: mockCompany.email,
    });
  });


  it('should throw NotFoundException when not has company with uuid', async () => {
    mockCompanyRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockCompany,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('company is not found'),
    );
  });
});
