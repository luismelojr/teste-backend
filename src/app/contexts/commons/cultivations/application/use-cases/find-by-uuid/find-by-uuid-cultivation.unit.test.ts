import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import {
  FindByUuidCultivation
} from 'commons/cultivations/application/use-cases/find-by-uuid/find-by-uuid-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';


describe('FindByUuidCultivation', () => {
  let useCase: FindByUuidCultivation;
  let mockCultivationRepository;

  const uuid = generateUuidV4();
  const mockCultivation = {
    uuid,
    name: 'Patria Agronegócios',
    description: 'Descrição',
  };


  beforeEach(async () => {
    mockCultivationRepository = {
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
        provide: CultivationRepository,
        useValue: mockCultivationRepository,
      },
    ];

    const useCases: Provider[] = [FindByUuidCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidCultivation>(FindByUuidCultivation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Cultivation', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCultivationRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockCultivation.name,
        description: mockCultivation.description,
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(new Cultivation({
        ...mockCultivation,
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

    it('should throw NotFoundException when not has Cultivation with uuid', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('cultivation is not found'),
      );
    });
  });
});
