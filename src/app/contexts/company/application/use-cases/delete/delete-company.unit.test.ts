import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeleteCompany } from './delete-company';
import { faker } from '@faker-js/faker';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { Company } from 'company/domain/company';

const uuid = generateUuidV4();
const cnpj = '90798163000154';

describe('DeleteCompany', () => {
  let useCase: DeleteCompany;
  let mockCompanyRepository;

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

    const infrastructure: Provider[] = [
      {
        provide: CompanyRepository,
        useValue: mockCompanyRepository,
      },
    ];

    const useCases: Provider[] = [DeleteCompany];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteCompany>(DeleteCompany);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete Company', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(new Company({
        ...mockCompany,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockCompanyRepository.delete).toHaveBeenCalledWith(uuid);
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

    it('should throw NotFoundException when not has Company with uuid', async () => {
      mockCompanyRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('company not found'),
      );
    });

  });
});
