import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import {
  DeleteCultivation
} from 'commons/cultivations/application/use-cases/delete/delete-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';

const uuid = generateUuidV4();

describe('DeleteCultivation', () => {
  let useCase: DeleteCultivation;
  let mockCultivationRepository;

  const mockCultivation = {
    name: 'Patria Agronegócios',
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

    const useCases: Provider[] = [DeleteCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteCultivation>(DeleteCultivation);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete Cultivation', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockCultivationRepository.delete).toHaveBeenCalledWith(uuid);
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
        new NotFoundException('cultivation not found'),
      );
    });

  });
});
