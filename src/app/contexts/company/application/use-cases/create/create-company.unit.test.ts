import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateCompany } from './create-company';
import { CityService } from 'commons/locations/city/application/city.service';
import { City } from 'commons/locations/city/domain/city';
import { faker } from '@faker-js/faker';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { Company } from 'company/domain/company';

const uuid = generateUuidV4();
const cnpj = '90798163000154';

describe('CreateCompany', () => {
  let useCase: CreateCompany;
  let mockCompanyRepository;
  let mockCityService;

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

    const useCases: Provider[] = [CreateCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateCompany>(CreateCompany);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create Company', async () => {
      mockCompanyRepository.create.mockResolvedValue(new Company({
        ...mockCompany,
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
        name: mockCompany.name,
        tradeName: mockCompany.tradeName,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        email: mockCompany.email,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith(new Company({
        ...mockCompany,
        city: mockCity,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockCompany.name,
        tradeName: mockCompany.tradeName,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        city: {
          uuid: uuid,
        },
        address: mockCompany.address,
        email: mockCompany.email,
      });
    });

    it('should create Company when city is not present', async () => {
      mockCompanyRepository.create.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockCompany.name,
        tradeName: mockCompany.tradeName,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        address: 'Wall Street',
        email: mockCompany.email,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith(new Company({
        ...mockCompany,
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

    it('should throw BadRequestException when not has name', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        email: mockCompany.email,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('name is required'),
      );
    });

    it('should throw BadRequestException when not has cnpj', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockCompany.name,
        cnpj: undefined,
        phone: mockCompany.phone,
        city: {
          uuid: uuid,
        },
        address: 'Wall Street',
        email: mockCompany.email,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('cnpj is required'),
      );
    });
  });
});
