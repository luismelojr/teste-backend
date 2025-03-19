import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import {
  UpdateCultivation
} from 'commons/cultivations/application/use-cases/update/update-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';

const uuid = generateUuidV4();

describe('UpdateCultivation', () => {
  let useCase: UpdateCultivation;
  let mockCultivationRepository;

  const mockCultivation = {
    name: 'Patria Agronegócios',
    description: 'descrição',
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

    const useCases: Provider[] = [UpdateCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateCultivation>(UpdateCultivation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update eventType', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      mockCultivationRepository.update.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockCultivation,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCultivationRepository.update).toHaveBeenCalledWith(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockCultivation.name,
        description: mockCultivation.description,
      });
    });
  });


  it('should throw NotFoundException when not has Cultivation with uuid', async () => {
    mockCultivationRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockCultivation,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('cultivation is not found'),
    );
  });
});
