import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidCompany } from './find-by-uuid-company';
import { faker } from '@faker-js/faker';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { Company } from 'company/domain/company';

const uuid = generateUuidV4();
const cnpj = '90798163000154';

describe('FindByUuidCompany', () => {
  let useCase: FindByUuidCompany;
  let mockCompanyRepository;

  const uuid = generateUuidV4();
  const mockCompany = {
    uuid,
    name: 'Patria Agronegócios',
    tradeName: 'Patria Agronegócio',
    cnpj,
    phone: '999999999',
    address: 'Wall Street',
    city: {
      id: '1',
      uuid: uuid,
    },
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

    const infrastructure: Provider[] = [
      {
        provide: CompanyRepository,
        useValue: mockCompanyRepository,
      },
    ];

    const useCases: Provider[] = [FindByUuidCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidCompany>(FindByUuidCompany);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid company', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCompanyRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockCompany.name,
        tradeName: mockCompany.tradeName,
        cnpj: mockCompany.cnpj,
        phone: mockCompany.phone,
        address: 'Wall Street',
        email: mockCompany.email,
        city: {
          uuid: uuid,
        },
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
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

    it('should throw NotFoundException when not has company with uuid', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('company is not found'),
      );
    });
  });
});
